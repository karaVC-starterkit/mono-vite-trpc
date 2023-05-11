import { transformDocument } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { CookieSerializeOptions, serialize } from "cookie";
import { z } from "zod";
import { decodeJWT, encodeJWT, encryptPassword } from "../../utils/auth";
import { createDigits } from "../../utils/createDigits";
import { sendEmailVerification } from "../../utils/mailer";
import { router, publicProcedure, protectedProcedure, t } from "../trpc";

const cookieOptions: CookieSerializeOptions = {
  httpOnly: true,
  // secure: process.env.NODE_ENV === "production",
  // sameSite: "strict",
  // path: "/",
  maxAge: 60 * 60 * 24 * 7, // 1 week
};

const SignUpRouter = router({
  getUser: publicProcedure.query(() => "hello my friend"),
  credential: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { email, password } = input;
        const code = createDigits(6);

        const user = await ctx.prisma.user.findUnique({ where: { email } });

        if (user) throw new Error("User already exists.");

        const newUser = await ctx.prisma.user.create({
          data: {
            email,
            password: await encryptPassword(password),
          },
        });

        await sendEmailVerification(email, code);

        const token = encodeJWT(
          { userId: newUser.id, email, code },
          "SIGN_UP_VALIDATE_EMAIL",
          {
            expiresIn: "24h",
          }
        );

        ctx.res.setHeader(
          "Set-Cookie",
          `${serialize("token", token, cookieOptions)}`
        );
        return { token };
      } catch (e) {
        console.error(e);
      }
    }),
  verifyEmail: publicProcedure
    .input(z.object({ code: z.string().nullable() }))
    .mutation(async ({ ctx, input }) => {
      const { code: _code } = input;
      const { token } = ctx.req.cookies;
      try {
        if (!_code) throw new TRPCError({ code: "BAD_REQUEST" });

        const { code, email } = decodeJWT(token, "SIGN_UP_VALIDATE_EMAIL");

        if (code !== _code) throw new TRPCError({ code: "BAD_REQUEST" });
        const user = await ctx.prisma.user.findUnique({ where: { email } });
        if (user?.emailVerifiedAt) throw new Error("EMAIL_IS_VALIDATED");
        await ctx.prisma.user.update({
          where: {
            email,
          },
          data: {
            emailVerifiedAt: new Date(),
          },
        });

        return {
          status: "success",
        };
      } catch (e) {
        console.error(e);
      }
    }),
});

export default SignUpRouter;
