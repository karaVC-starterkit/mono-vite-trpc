import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as trpcExpress from "@trpc/server/adapters/express";
import appRouter from "./router";
import { PrismaClient } from "@prisma/client";

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
  prisma: new PrismaClient(),
});

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      process.env.LANDING_URL as string,
      process.env.DASHBOARD_URL as string,
    ],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(
  "/api",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export default app;
export { createContext };
