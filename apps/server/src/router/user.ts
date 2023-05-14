import { z } from "zod";
import { router, publicProcedure, privateProcedure, t } from "../trpc";

const userRouter = router({
  get: privateProcedure.mutation(() => {
    return { message: "hello123" };
  }),
  exampleWithArgs: publicProcedure
    .input(
      z.object({
        message: z.string(),
      })
    )
    .mutation((req) => {
      return { info: req.input.message };
    }),

  exampleUser: publicProcedure.query(async ({ ctx }) => {
    return { info: 42 };
  }),
  // authExample: protectedProcedure
  //   .use(
  //     t.middleware(({ ctx, next }) => {
  //       console.log("hello");
  //       return next();
  //     })
  //   )
  //   .query(() => {
  //     return { message: "hello" };
  //   }),
});

export default userRouter;
