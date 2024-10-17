import express from "express";
import morgan from "morgan";
import cors from "cors";
import { pricePerKm, surgcharge } from "./config.js";
<<<<<<< HEAD
import mongoose from "mongoose";
import Booking from "./models/Booking.js";
import dotenv from "dotenv";
import Driver from "./models/Driver.js";
// Rest object
const app = express();
dotenv.config();
=======

// Rest object
const app = express();

>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
 
// Routes
<<<<<<< HEAD
const connect = () => {
  mongoose.set("strictQuery", false);
  mongoose
      .connect(process.env.MONGO)
      .then(() => {
          console.log("Connected to DB");
      })
      .catch((err) => {
          throw err;
      });
};
connect()


app.get("/api/price/get", async (req, res) => {
  try {
    let { traffic, distance, isRaining,lat,lng } = req.query;
    console.log(traffic, distance, isRaining,lat,lng);
=======
app.get("/api/price/get", (req, res) => {
  try {
    let { traffic, distance, isRaining } = req.query;

>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
    let miniPrice = pricePerKm["mini"] * (distance / 1000);
    let truckPrice = pricePerKm["truck"] * (distance / 1000);
    let bigTruckPrice = pricePerKm["big-truck"] * (distance / 1000);

<<<<<<< HEAD
    // const range = 20 / 6371; // 10 km in radians, Earth's radius is approximately 6371 km
    // const availableDriversCount = await Driver.countDocuments({
    //   isAvailable: true,
    //   currentLocation: {
    //   $geoWithin: {
    //     $centerSphere: [[lng, lat], range]
    //   }
    //   }
    // });

    // const pendingBookingsCount = await Booking.countDocuments({
    //   status: "pending",
    //   src: {
    //   $geoWithin: {
    //     $centerSphere: [[lng, lat], range]
    //   }
    //   }
    // });

    // if(availableDriversCount==0){
    //   return res.status(400).json({message: "No driver available in your area"});
    // }
    if (!distance || distance==0) {
      return res
      .status(400)
      .json({ message: "Traffic and distance are required" });
    }
    let totalSurcharge = 0;
    
    // let ratio;
    // if(pendingBookingsCount>0){
    //   ratio = Math.round((pendingBookingsCount / availableDriversCount) * 2) / 2;
    // }
    // totalSurcharge+=(ratio/10);
=======
    if (!distance || distance==0) {
      return res
        .status(400)
        .json({ error: "Traffic and distance are required" });
    }
    let totalSurcharge = 0;

>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
    if (distance / 1000 > 100) {
      totalSurcharge += surgcharge["dist>100"];
    }
    if (distance / 1000 > 200) {
      console.log(distance, "distance");
      totalSurcharge += surgcharge["dist>200"];
    }
    if (new Date().getHours() >= 20 || new Date().getHours() <= 6) {
      totalSurcharge += surgcharge["night"];
    }
    if(traffic==undefined || !traffic){
      traffic = "traffic-low";
    }
    totalSurcharge += surgcharge[traffic];
    if (isRaining) {
      totalSurcharge += surgcharge["rain"];
    }

    miniPrice += miniPrice * totalSurcharge;
    truckPrice += truckPrice * totalSurcharge;
    bigTruckPrice += bigTruckPrice * totalSurcharge;
    // console.log("object", miniPrice, truckPrice, bigTruckPrice);
    return res.status(200).json({
      data: {
        price: {
          "mini truck": miniPrice.toFixed(2),
          truck: truckPrice.toFixed(2),
          "big truck": bigTruckPrice.toFixed(2),
        },
      },
      message: "Price fetched successfully",
    });
  } catch (error) {
    console.log(error, "error");
    return res
      .status(500)
      .json({ message: "An error occurred while fetching price." });
  }
});

// PORT
const PORT = process.env.PORT || 8080;

// Run listen
app.listen(PORT, () => {
  console.log(
    `Server Running on port ${PORT}`
  );
});
