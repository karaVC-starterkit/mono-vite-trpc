import { transformDocument } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { CookieSerializeOptions, serialize } from "cookie";
import { z } from "zod";
import {
  comparePassword,
  decodeJWT,
  encodeJWT,
  encryptPassword,
} from "../../utils/auth";
import { createDigits } from "../../utils/createDigits";
import { cookieOptions } from "../../utils/defaults";
import { sendEmailVerification } from "../../utils/mailer";
import { router, publicProcedure, protectedProcedure, t } from "../trpc";

const SignInRouter = router({
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

        const user = await ctx.prisma.user.findUnique({ where: { email } });
        if (!user)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid email or password",
          });

        const samePassword = await comparePassword(
          password,
          user.password as string
        );

        if (!samePassword)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid email or password",
          });

        const token = encodeJWT(
          { userId: user.id, email },
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
  sendCookie: publicProcedure.query(({ ctx }) => {
    const { token } = ctx.req.cookies;
    return token;
  }),
});

export default SignInRouter;
