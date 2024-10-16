import express, { NextFunction, Request, Response } from "express";
import { createUser } from "./userController";

const userRouter = express.Router();

// routes
userRouter.post(
  "/register",
  createUser as (req: Request, res: Response, next: NextFunction) => void
);

export default userRouter;
