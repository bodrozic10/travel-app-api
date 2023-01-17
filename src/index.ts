import { config } from "dotenv";
import mongoose from "mongoose";
import { app } from "./app";

config();

app.listen(process.env.port || 3000, () => {
  console.log("Server is running on port 3000");
  mongoose.connect(process.env.MONGODB_URI as string, () => {
    console.log(`connected to db`);
  });
});
