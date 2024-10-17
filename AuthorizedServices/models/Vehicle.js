import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["mini truck", "truck", "big truck"],
    },
    numberPlate: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    model: {  //model of the vehicle
      type: String,
      required: true,
      trim: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      unique: false,
      index: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    imageUrl: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
