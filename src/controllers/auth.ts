import { NextFunction, Request, Response } from "express";
import { AuthenticationError } from "../errors/AuthenticationError";
import { User } from "../models/user";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  res.send("login");
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AuthenticationError("Email in use");
    }
    if (passwordConfirm !== password) {
      throw new AuthenticationError("Passwords must match");
    }
    const user = User.build({ name, email, password, passwordConfirm });
    await user.save();

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  } catch (error: any) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  req.session = null;
  res.send({});
};

export const currentUser = async (req: Request, res: Response) => {
  if (req.session?.jwt) {
    res.send("currentUser");
  } else {
    res.send({});
  }
};
