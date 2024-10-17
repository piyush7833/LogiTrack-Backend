import { instance } from "../index.js";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
<<<<<<< HEAD
import crypto from 'crypto';
=======
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69

export const checkout=async(req,res,next)=>{
    try {
      const {amount}=req.body;
      const options = {
        amount: amount*100,  // amount in the smallest currency unit //500rs
        currency: "INR",
        receipt: "order_rcptid_11"
      };
      const order= await instance.orders.create(options); 
      // console.log(order,"order")
      res.status(200).send({
        success: true,
        order,
        message: "Payment initiated Successfully",
      });
    } catch (error) {
      res.status(400).send({
        success: false,
        error,
        message: "Error While checkout",
      });
      console.log(error);
    }
  }
  
  export const paymemtVerification=async(req,res,next)=>{
    try {    
      const {razorpay_order_id,razorpay_signature,razorpay_payment_id,bookingId,userId}=req.body;  //destructuring
      // console.log(razorpay_order_id,razorpay_signature,razorpay_payment_id);
      const body=razorpay_order_id + "|" + razorpay_payment_id;
  
      const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                                      .update(body.toString())
                                      .digest('hex');
      const isAuthentic=expectedSignature===razorpay_signature;
      if(isAuthentic){
       const payment= await Payment.create({
          userId:req.user.id,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        })
<<<<<<< HEAD
        console.log(bookingId)
=======
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
        const booking= await Booking.findByIdAndUpdate(bookingId,{paymentId:payment._id},{new:true});
        return res.status(200).json({message:"Payment is successful"});
      }
      else{
        res.status(400).json("Payment is not valid")
      }
  
    } catch (error) {
      res.status(400);
      console.log(error);
    }
  }