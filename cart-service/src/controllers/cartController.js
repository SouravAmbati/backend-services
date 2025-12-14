
import redis from "../config/redis.js";
import userModel from "../models/User.js";

const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, productSize } = req.body;

        const userData = await userModel.findById(userId);
        if (!userData) return res.status(404).json({ success: false, message: "User not found" });

        const cartData = userData.cartData || {}; // initialize if undefined

        if (cartData[itemId]) {
            cartData[itemId][productSize] = (cartData[itemId][productSize] || 0) + 1;
        } else {
            cartData[itemId] = { [productSize]: 1 };
        }

        await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
        await redis.del(`cart:${userId}`);

        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const UpdateCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, productSize, quantity } = req.body;

        const userData = await userModel.findById(userId);
        if (!userData) return res.status(404).json({ success: false, message: "User not found" });

        const cartData = userData.cartData || {};
        if (!cartData[itemId]) cartData[itemId] = {};
        cartData[itemId][productSize] = quantity;

        await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
        await redis.del(`cart:${userId}`);

        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const GetUserCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cacheKey = `cart:${userId}`;
        const cachedCart = await redis.get(cacheKey);
        if (cachedCart) {
            return res.json({ success: true, fromCache: true, cartData: JSON.parse(cachedCart) });
        }

        const userData = await userModel.findById(userId);
        if (!userData) return res.status(401).json({ success: false, message: "User not found" });

        const cartData = userData.cartData || {};
        await redis.set(cacheKey, JSON.stringify(cartData), "EX", 60 * 5);

        res.json({ success: true, fromCache: false, cartData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addToCart, UpdateCart, GetUserCart };
