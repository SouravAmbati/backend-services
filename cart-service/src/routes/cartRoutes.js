import express from "express";
import {
  addToCart,
  GetUserCart,
  UpdateCart,
} from "../controllers/cartController.js";
import Authuser from "../middleware/Auth.js";

const cartRouter = express.Router();
cartRouter.get("/get", Authuser, GetUserCart);
cartRouter.post("/add", Authuser, addToCart);
cartRouter.put("/update", Authuser, UpdateCart);

export default cartRouter;
