import express from "express";
import { login, logout, register, currentUser } from "../controllers/auth";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validateRequest";

const router = express.Router();

router.route("/login").post(login);

router
  .route("/register")
  .post(
    [
      body("name").notEmpty().withMessage("You must provide your name"),
      body("email").isEmail().withMessage("You must provide a valid email"),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
      body("passwordConfirm")
        .isLength({ min: 6 })
        .withMessage("Passwords must match"),
    ],
    validateRequest,
    register
  );

router.route("/logout").post(logout);

router.route("/currentuser").get(currentUser);

export default router;
