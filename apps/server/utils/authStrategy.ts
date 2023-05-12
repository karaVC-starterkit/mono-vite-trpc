import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import { Strategy as GithubStrategy } from "passport-github2";
//@ts-ignore
import { Strategy as SlackStrategy } from "passport-slack-oauth2";
import { prisma } from "./prisma";
import { TRPCError } from "@trpc/server";

passport.serializeUser((user: any, done) => {
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id: any, done) => {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      // console.log({ GoogleProfile: profile });
      // //done(null,currentUser)
      // done(null, profile);
      console.log(profile._json.email);
      if (!profile._json.email)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email not provided",
        });
      var user = await prisma.user.findUnique({
        where: { email: profile._json.email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: { email: profile._json.email },
        });
      }
      done(null, user);
    }
  )
);

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: "/auth/google/callback",
    },
    function (
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: (arg0: null, arg1: any) => any
    ) {
      console.log({ GithubProfile: profile });
      return done(null, profile);
    }
  )
);

// passport.use(
//   new MicrosoftStrategy(
//     {
//       clientID: process.env.MICROSOFT_CLIENT_ID as string,
//       clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
//       callbackURL: "",
//     },
//     function (accessToken: any, refreshToken: any, profile: any, done: any) {}
//   )
// );
// passport.use(
//   new SlackStrategy.Strategy(
//     {
//       clientID: process.env.SLACK_CLIENT_ID,
//       clientSecret: process.env.SLACK_CLIENT_SECRET,
//       callbackURL: "",
//       scope: ["identity.basic", "identity.email", "identity.avatar"],
//     },
//     function (accessToken: any, refreshToken: any, profile: any, done: any) {}
//   )
// );

export default passport;
