import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  //   validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "all fields are required");
    return next(error);
  }

  try {
    //   check if user already exist
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(400, "user already exist");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "Error while getting user"));
  }

  //    hashed password
  const hashPassword = await bcrypt.hash(password, 10);

  let newUser: User;
  try {
    //   create record in db
    newUser = await userModel.create({
      name,
      password: hashPassword,
      email,
    });
  } catch (err) {
    return next(createHttpError(500, "error while creating user"));
  }

  try {
    //   generate token
    const token = sign({ sub: newUser._id }, config.SECRET as string, {
      expiresIn: "7d",
    });

    //   send response
    return res.status(201).json({ token });
  } catch (error) {
    return next(createHttpError(500, "error while signing token"));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  // validation
  if (!email || !password) {
    return next(createHttpError(400, "email, password is required"));
  }
  let user;
  try {
    // check user exists in db
    user = await userModel.findOne({ email });

    if (!user) {
      return next(createHttpError(404, "user not exist"));
    }
  } catch (error) {
    return next(createHttpError(500, "error while getting user"));
  }
  try {
    // now check password
    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      return next(createHttpError(400, "username password is incorrect"));
    }
  } catch (error) {
    return next(createHttpError(500, "error while matching password"));
  }

  try {
    const token = sign({ sub: user._id }, config.SECRET as string, {
      expiresIn: "7d",
    });

    return res.status(200).json({ token });
  } catch (error) {
    return next(createHttpError(500, "error while sign token"));
  }
};

export { createUser, loginUser };
