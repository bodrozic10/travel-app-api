import express from "express";
import {
  getAccommodations,
  createAccommodation,
  deleteAccommodation,
  getAccommodation,
  updateAccommodation,
} from "../controllers/accommodaions";
import { body, param } from "express-validator";
import { validateRequest } from "../middlewares/validateRequest";
import { currentUser } from "../middlewares/currentUser";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router
  .route("/")
  .get(getAccommodations)
  .post(
    [
      body("name").isLength({ min: 3 }).withMessage("Name is required"),
      body("price").isNumeric().withMessage("Price is required"),
      body("location").isObject().withMessage("Location is required"),
    ],
    validateRequest,
    currentUser,
    requireAuth,
    createAccommodation
  );

router
  .route("/:id")
  .get(
    [param("id").isMongoId().withMessage("Invalid ID")],
    validateRequest,
    getAccommodation
  )
  .put(
    [param("id").isMongoId().withMessage("Invalid ID")],
    validateRequest,
    currentUser,
    requireAuth,
    updateAccommodation
  )
  .delete(
    [param("id").isMongoId().withMessage("Invalid ID")],
    validateRequest,
    currentUser,
    requireAuth,
    deleteAccommodation
  );

export default router;
