import express from 'express'
import adminAuth from '../middlewares/adminAuth.js';
import Authuser from '../middlewares/Auth.js';
import { allOrders, placeOrder, placeOrderStripe, updateStatus, userOrders, verifyStripe } from '../controllers/orderController.js';

const orderRouter=express.Router();
orderRouter.get('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

//payment features
orderRouter.post('/place',Authuser,placeOrder)
orderRouter.post('/stripe',Authuser,placeOrderStripe)

//user feature
orderRouter.post('/userorders',Authuser,userOrders)

//verify payment
orderRouter.post('/verifystripe',Authuser,verifyStripe)

export default orderRouter