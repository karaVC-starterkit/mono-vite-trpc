import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import passport from "passport";
import { decodeJWT } from "../utils/auth";
import { createContext } from "./app";

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ ctx, next }) => {
  const { req, res } = ctx;
  let user = req.user as Express.User;

  if (!user) {
    const { session } = req.cookies;
    user = decodeJWT(session, "SIGN_UP_VALIDATE_EMAIL");
  }
  return next({
    ctx: {
      user,
    },
  });
});

const router = t.router;
const publicProcedure = t.procedure;
const privateProcedure = t.procedure.use(isAuthed);
const mergeRouters = t.mergeRouters;

export { t, router, publicProcedure, privateProcedure, mergeRouters };
export type { Context };
