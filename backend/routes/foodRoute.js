import express from "express"
import { addFood,listFood,removeFood } from "../controllers/foodController.js"
import multer from "multer"      // image storage section

const foodRouter = express.Router();

//logic for image to be stored in image folder

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const uploads = multer({storage:storage})

foodRouter.post("/add",uploads.single("image"), addFood); // eithe upload cha uploads kela tu just to remember
foodRouter.get("/list",listFood)
foodRouter.post("/remove",removeFood);




export default foodRouter;
