import mongoose from "mongoose";

export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://bhaktiabhay99:Bhakti_1234@cluster0.w59pi.mongodb.net/food-del').then(()=>console.log("DB Connected"));

}
