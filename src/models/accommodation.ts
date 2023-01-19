import mongoose from "mongoose";

interface AccommodationAttrs {
  name: string;
  description?: string;
  price: number;
  location: any;
  images?: string[];
  // rating: number;
  // numReviews: number;
  user: string;
}

interface AccommodationDoc extends mongoose.Document {
  name: string;
  description?: string;
  price: number;
  location: any;
  images?: string[];
  rating: number;
  numReviews: number;
  user: string;
}

interface AccommodationModel extends mongoose.Model<AccommodationDoc> {
  build(attrs: AccommodationAttrs): AccommodationDoc;
}

const accommodationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "No description",
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    images: {
      type: Array,
      default: [],
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

accommodationSchema.statics.build = (attrs: AccommodationAttrs) => {
  return new Accommodation(attrs);
};

const Accommodation = mongoose.model<AccommodationDoc, AccommodationModel>(
  "Accommodation",
  accommodationSchema
);

export { Accommodation };
