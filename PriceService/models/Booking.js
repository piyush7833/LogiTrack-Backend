import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    distance:{
        type: Number,
    },
    duration: {
        type: String, 
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    src: {
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
    destn: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: false,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    srcName: {
      type: String,
    },
    destnName: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      index: true,
    },
    price:{
        type: Number,
    },
    status: {
      type: String,
      enum: ["pending", "accepted","collected","completed", "cancelled"],
      default: "pending",
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
