import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import { Strategy as GithubStrategy } from "passport-github2";
//@ts-ignore
import { Strategy as SlackStrategy } from "passport-slack-oauth2";
import { prisma } from "./prisma";
import { TRPCError } from "@trpc/server";
import { IUser } from "./types";

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: any, done) => {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});

const handleUser = async (_user: IUser, done: any, profile: any) => {
  try {
    var user = await prisma.user.findUnique({
      where: { email: _user.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { ..._user, emailVerifiedAt: new Date() },
      });
    }
    done(null, user);
  } catch (e) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Something went wrong ${profile}`,
    });
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      if (!profile._json.email)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email not provided",
        });
      if (!profile._json.given_name)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "given_name(firstname) not provided",
        });
      if (!profile._json.family_name)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "family_name(lastname) not provided",
        });

      handleUser(
        {
          email: profile._json.email,
          firstname: profile._json.given_name,
          lastname: profile._json.family_name,
          fullname: `${profile._json.given_name} ${profile._json.family_name}`,
        },
        done,
        profile
      );
    }
  )
);

passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.MICROSOFT_CLIENT_ID as string,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
      callbackURL: "/auth/microsoft/callback",
      scope: ["user.read"],
    },
    function (accessToken: any, refreshToken: any, profile: any, done: any) {
      handleUser(
        {
          email: profile._json.userPrincipalName,
          firstname: profile._json.givenName,
          lastname: profile._json.surname,
          fullname: `${profile._json.givenName} ${profile._json.surname}`,
        },
        done,
        profile
      );
    }
  )
);


export default passport;
