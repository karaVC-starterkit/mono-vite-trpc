import { z } from "zod";
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
    .mutation((req) => {
      const { email, password } = req.input;
      console.log(email, password);
    }),
});

export default SignUpRouter;
