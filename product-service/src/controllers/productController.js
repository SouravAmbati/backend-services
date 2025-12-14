
import productModel from "../models/Product.js";
import redisClient from "../config/redis.js";
import cloudinary from "../config/cloudinary.js";

//function for add product
const Addproduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const images = ["image1","image2","image3","image4"]
      .map(key => req.files[key] && req.files[key][0])
      .filter(Boolean);

    const imagesURL = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true",
      sizes: sizes ? JSON.parse(sizes) : [],
      image: imagesURL,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    // Invalidate products cache
    await redisClient.del('products');

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    res.json({ success: false, msg: error.message });
    console.log(error);
  }
};

//function for List Product
const Listproducts = async (req, res) => {
  try {
    const cachedData = await redisClient.get("products");
    if (cachedData) {
      console.log("✅ Fetched from Redis Cache");
      return res.json({ success: true, products: JSON.parse(cachedData) });
    }
    const products = await productModel.find({});
    await redisClient.setEx('products',3600,JSON.stringify(products));
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: false, msg: error.message });
    console.log(error);
  }
};
//function for Remove Product
const Removeproduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    await redisClient.del('products');
    res.json({ success: true, msg: "Product Removed" });
  } catch (error) {
    res.json({ success: false, msg: error.message });
    console.log(error);
  }
};
//function for Single product info
const Singleproduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const cachedProduct=await redisClient.get(`product:${productId}`)
    if(cachedProduct){
         return res.json({ success: true, ...JSON.parse(cachedProduct) });
    }
    const product = await productModel.findById(productId);
    await redisClient.setEx(`product:${productId}`, 3600, JSON.stringify(product));
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, msg: error.message });
    console.log(error);
  }
};
export { Addproduct, Listproducts, Removeproduct, Singleproduct };
