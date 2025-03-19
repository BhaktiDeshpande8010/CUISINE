import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});

// Placing user orders from frontend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Creating order in Razorpay
        const options = {
            amount: req.body.amount * 100, // Convert to paise
            currency: "INR",
            receipt: `receipt_${newOrder._id}`
        };

        const order = await razorpay.orders.create(options);

        // ✅ Save Razorpay order ID in database
        await orderModel.findByIdAndUpdate(newOrder._id, { razorpay_order_id: order.id });

        res.json({
            success: true,
            order_id: order.id,  // Razorpay order ID
            amount: order.amount,
            currency: order.currency,
            success_url: `${frontend_url}/verify?success=true&razorpay_order_id=${order.id}`,
            cancel_url: `${frontend_url}/verify?success=false&razorpay_order_id=${order.id}`
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Verify Order after payment
const verifyOrder = async (req, res) => {
    const { razorpay_order_id, success, razorpay_payment_id, razorpay_signature } = req.body;

    console.log("🔵 Verify Order API hit with:", req.body); // Debugging

    try {
        if (success === "true") {
            // Verify Razorpay signature
            const generated_signature = crypto
                .createHmac("sha256", process.env.RAZORPAY_SECRET)
                .update(razorpay_order_id + "|" + razorpay_payment_id)
                .digest("hex");

            if (generated_signature === razorpay_signature) {
                // ✅ Find order by Razorpay order ID instead of MongoDB _id
                const order = await orderModel.findOneAndUpdate(
                    { razorpay_order_id },
                    { payment: true }
                );

                if (!order) {
                    return res.json({ success: false, message: "Order not found." });
                }

                return res.json({ success: true, message: "Payment verified and order marked as paid." });
            } else {
                return res.json({ success: false, message: "Invalid payment signature." });
            }
        } else {
            // Payment failed, delete the order
            await orderModel.findOneAndDelete({ razorpay_order_id });
            return res.json({ success: false, message: "Payment failed. Order deleted." });
        }
    } catch (error) {
        console.log("Payment verification error:", error);
        return res.json({ success: false, message: "Error verifying payment." });
    }
};

// Fetch user orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// listing the order for admin panel

const listOrder = async (req,res) => {
    try {
        const order = await orderModel.find({});
        res.json({success:true,data:order})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}

//api for updating order status

const updateStatus = async (req,res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.order_id,{status:req.body.status});
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export { placeOrder, verifyOrder, userOrders, listOrder,updateStatus  };
