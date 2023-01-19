import { Request, Response, NextFunction } from "express";
import { Accommodation } from "../models/accommodation";
import { NotFoundError } from "../errors/NotFoundError";
import { AuthenticationError } from "../errors/AuthenticationError";

export const getAccommodations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accomodations = await Accommodation.find({});
    res.status(200).send(accomodations);
  } catch (error) {
    next(error);
  }
};

export const getAccommodation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) {
      throw new NotFoundError("Accommodation not found");
    }
    res.status(200).send(accommodation);
  } catch (error) {
    next(error);
  }
};

export const createAccommodation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, price, location, images } = req.body;
    const accommodation = Accommodation.build({
      name,
      description,
      price,
      user: req.currentUser!.id,
      location,
      images,
    });
    await accommodation.save();
    res.status(201).send(accommodation);
  } catch (error) {
    next(error);
  }
};

export const updateAccommodation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, price, location, images } = req.body;
    const { id } = req.params;
    const accommodation = await Accommodation.findById(id);
    if (!accommodation) {
      throw new NotFoundError("Accommodation not found");
    }

    if (accommodation.user.toString() !== req.currentUser!.id.toString()) {
      throw new AuthenticationError(
        "You are not authorized to update this accommodation"
      );
    }
    accommodation.set({
      name: name || accommodation.name,
      description: description ?? accommodation.description,
      price: price || accommodation.price,
      location: location || accommodation.location,
      images: images || accommodation.images,
    });
    await accommodation.save();
    res.status(200).send(accommodation);
  } catch (error) {
    next(error);
  }
};

export const deleteAccommodation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accommodation = await Accommodation.findByIdAndDelete(req.params.id);
    if (!accommodation) {
      throw new NotFoundError("Accommodation not found");
    }
    if (accommodation.user.toString() !== req.currentUser!.id.toString()) {
      throw new AuthenticationError(
        "You are not authorized to update this accommodation"
      );
    }
    res.status(200).send({});
  } catch (error) {
    next(error);
  }
};
