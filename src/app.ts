import express from "express";
import authRouter from "./routes/auth";
import { errorMiddleware } from "./middlewares/error";
import cookieSession from "cookie-session";

const app = express();
app.use(express.json());

app.use(
  cookieSession({
    signed: false,
    // secure: process.env.NODE_ENV !== "test",
  })
);

app.use("/api/v1/auth", authRouter);

app.use(errorMiddleware);

export { app };
