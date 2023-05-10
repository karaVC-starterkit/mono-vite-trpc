import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { encodeJWT, encryptPassword } from "../../utils/auth";
import { createDigits } from "../../utils/createDigits";
import { sendEmailVerification } from "../../utils/mailer";
import { router, publicProcedure, protectedProcedure, t } from "../trpc";

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

      return encodeJWT(
        { userId: newUser.id, email, code },
        "SIGN_UP_VALIDATE_EMAIL",
        {
          expiresIn: "24h",
        }
      );
    }),
});

export default SignUpRouter;
