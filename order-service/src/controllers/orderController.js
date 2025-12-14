
import Stripe from "stripe";
import orderModel from "../models/ordermodel.js";
import redis from "../config/redis.js";
import userModel from "../models/userModel.js";

//Global variables
const currency='usd'
const deliveryCharge=10

//Gateway initialized
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)

//placing orders using COD
const placeOrder=async(req,res)=>{
    try {
        const {userId,items,amount,address}=req.body;
        const orderData={
            userId,
            items,
            amount,
            address,
            paymentMethod:"COD",
            payment:false,
            date:Date.now()
        }
        const newOrder=new orderModel(orderData);
        await newOrder.save()

        // CLEAR USER CACHE
        await redis.del(`orders_user_${userId}`);

        await userModel.findOneAndUpdate({ _id: userId }, { cartData: {} });
        res.json({success:true,message:"order placed"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})

    }
}


//placing orders using stripe method
const placeOrderStripe=async(req,res)=>{
    try {
        const {userId,items,amount,address}=req.body;
        const{origin}=req.headers

        const orderData={
            userId,
            items,
            amount,
            address,
            paymentMethod:"Stripe",
            payment:false,
            date:Date.now()
        };

        const newOrder=new orderModel(orderData);
        await newOrder.save()

        // CLEAR USER CACHE
        await redis.del(`orders_user_${userId}`);

        const line_items=items.map((item)=>({
            price_data:{
                currency:currency,
                product_data:{ name:item.name },
                unit_amount:item.price*100
            },
            quantity:item.quantity
        }));

        line_items.push({
            price_data:{
                currency:currency,
                product_data:{ name:'Delivery Charges' },
                unit_amount:deliveryCharge*100
            },
            quantity:1
        });

        const session=await stripe.checkout.sessions.create({
            success_url:`${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode:'payment'
        });

        res.json({success:true,session_url:session.url});
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


//verify stripe
const verifyStripe=async(req,res)=>{
    const {orderId,success,userId}=req.body
    try {
        if(success==="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            await userModel.findByIdAndUpdate(userId,{cartData:{}});

            // CLEAR USER CACHE
            await redis.del(`orders_user_${userId}`);

            res.json({success:true})
        }else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


// ------------ ADMIN ALL ORDERS (CACHED) ------------
const allOrders=async(req,res)=>{
    try {

        // CHECK CACHE
        const cachedOrders = await redis.get("all_orders");
        if (cachedOrders) {
            return res.json({success: true, orders: JSON.parse(cachedOrders), cached: true});
        }

        const orders = await orderModel.find({});

        // SET CACHE (60 seconds)
        await redis.set("all_orders", JSON.stringify(orders), "EX", 60);

        res.json({success:true,orders})
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}


// ------------ USER ORDERS (CACHED) ------------
const userOrders=async(req,res)=>{
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        // CHECK USER CACHE
        const cacheKey = `orders_user_${userId}`;
        const cachedOrders = await redis.get(cacheKey);

        if (cachedOrders) {
            return res.json({ success: true, orders: JSON.parse(cachedOrders), cached: true });
        }

        const orders = await orderModel.find({ userId });

        // SET CACHE for 60 seconds
        await redis.set(cacheKey, JSON.stringify(orders), "EX", 60);

        res.json({ success: true, orders });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}


//Update orders status only admin
const updateStatus=async(req,res)=>{
    try {
        const {orderId,status}=req.body
        const updated = await orderModel.findByIdAndUpdate(orderId,{status});

        // CLEAR CACHE
        await redis.del("all_orders");
        await redis.del(`orders_user_${updated.userId}`);

        res.json({success:true,message:'Status Updated'})
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export{
    placeOrder,
    placeOrderStripe,
    allOrders,
    userOrders,
    updateStatus,
    verifyStripe
}
