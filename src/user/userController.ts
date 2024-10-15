import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  //   validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "all fields are required");
    return next(error);
  }

  //   check if user already exist
  const user = await userModel.findOne({ email });
  if (user) {
    const error = createHttpError(400, "user already exist");
    return next(error);
  }
};

export { createUser };
