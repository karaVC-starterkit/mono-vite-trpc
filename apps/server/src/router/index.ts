import { mergeRouters, router } from "../trpc";
import SignUpRouter from "./signup";
import ExampleRouter from "./signup";
import userRouter from "./user";

type AppRouter = typeof appRouter;

const appRouter = router({
  signup: SignUpRouter,
  user: userRouter,
});

export default appRouter;
export type { AppRouter };
