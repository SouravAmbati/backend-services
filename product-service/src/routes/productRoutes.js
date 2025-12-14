import express from "express"
import { Addproduct, Listproducts, Removeproduct, Singleproduct } from "../controllers/productController.js";
import adminAuth from "../../middlewares/adminAuth.js";
import upload from "../../middlewares/multer.js";

const router=express.Router();

router.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  Addproduct
);

router.post("/remove", adminAuth, Removeproduct);
router.post("/single", Singleproduct);
router.get("/list", Listproducts);


export default router