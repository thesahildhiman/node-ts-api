import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import globalErrorHandler from "./middleware/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";
import cors from "cors";
import { config } from "./config/config";

const app = express();

// cors
app.use(cors({ origin: config.FRONTEND_URL }));

app.use(express.json());

// routes
app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

// middleware- function that placed between router and handler
// global error handler - should be placed at last after all routes
// sometimes we got error in req-handler, then control goes to global error handler which sends the response to client accordingly
// error handler contains 4 parameters- err, req, res, next

// global error handler
app.use(
  globalErrorHandler as (
    err: HttpError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => void
);

export default app;
