import jwt from "jsonwebtoken";

const Authuser = (req, res, next) => {
  // Example in Express middleware
  const token =req.headers["token"] || req.headers["authorization"]?.split(" ")[1];
  console.log(token);

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized, login again" });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: token_decode.id }; // ✅ Attach user object
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: error.message });
  }
};

export default Authuser;
