import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  userId: string;
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token) {
    return next(createHttpError(401, "auth token is required"));
  }

  try {
    // parse token
    const parsedToken = token.split(" ")[1];
    const decodedToken = verify(parsedToken, config.SECRET as string);

    //   attach the userId to req- so it is accessed inside request handler
    const _req = req as AuthRequest;

    //   here both req,_req referencing to same object
    _req.userId = decodedToken.sub as string;

    next(); // subsequest middleware/handler call
  } catch (err) {
    return next(createHttpError(401, "token expired"));
  }
};

export default auth;
