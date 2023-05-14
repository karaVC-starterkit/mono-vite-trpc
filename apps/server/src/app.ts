import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as trpcExpress from "@trpc/server/adapters/express";
import appRouter from "./router";
import { PrismaClient } from "@prisma/client";
import passport from "../utils/authStrategy";
import cookieSession from "cookie-session";
import { prisma } from "../utils/prisma";
import { cookieOptions } from "../utils/defaults";

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
  prisma: prisma,
});

const app = express();

app.use(express.json());

// app.use(
//   cors({
//     origin: [
//     //   process.env.LANDING_URL as string,
//       process.env.DASHBOARD_URL as string,
//       // "http://localhost:5001",
//     ],
//     // origin: "http://localhost:5173",
//     // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     // allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,

//   })
// );
app.use(cookieParser());
app.use(
  cookieSession({
    secret: process.env.SESSION_SECRET as string,
    ...cookieOptions,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: process.env.APP_URL as string,
    credentials: true,
  })
);
app.use(
  "/api",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(process.env.APP_URL as string);
  }
);

app.get(
  "/auth/microsoft",
  passport.authenticate("microsoft", { prompt: "select_account" })
);
app.get(
  "/auth/microsoft/callback",
  passport.authenticate("microsoft", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(process.env.APP_URL as string);
  }
);

export default app;
export { createContext };
