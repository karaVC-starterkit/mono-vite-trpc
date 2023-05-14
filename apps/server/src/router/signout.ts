import { transformDocument } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { CookieSerializeOptions, serialize } from "cookie";
import passport from "passport";
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
import { router, publicProcedure, t } from "../trpc";

const SignOutRouter = router({
  signOut: publicProcedure.mutation(({ ctx }) => {
    ctx.res.clearCookie("session");
    ctx.res.clearCookie("session.sig");

    return { status: "success" };
  }),
});

export default SignOutRouter;
