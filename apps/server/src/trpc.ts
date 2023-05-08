import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import { createContext } from "./app";

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ ctx, next }) => {
  const { req, res } = ctx;

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) throw new TRPCError({ code: "UNAUTHORIZED" });
    return next({
        ctx: {
          // JWT Payload
      }
  });
});

const router = t.router;
const publicProcedure = t.procedure;
const protectedProcedure = t.procedure.use(isAuthed);
const mergeRouters = t.mergeRouters;

export { t, router, publicProcedure, protectedProcedure, mergeRouters };
export type { Context };
