import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"



//APP config
const app = express()
const port = process.env.PORT || 4000;

// middleware
app.use(express.json()) // whenvere we will get the request from frontend to backend that will be passed using this jeson
app.use(cors()) // using this we can access any backend from frontend

// db connection
connectDB();

//api endpoint
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads')) 
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)


app.get("/",(req,res)=>{
    res.send("API Working")
}) // by get() we can request data from server


// run the express server
app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})


//mongodb+srv://bhaktiabhay99:Bhakti_1234@cluster0.w59pi.mongodb.net/?  