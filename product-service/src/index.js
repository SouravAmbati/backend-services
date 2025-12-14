import "dotenv/config";
import { connectDB } from "./config/mongodb.js";
import app from "./app.js";

const PORT = process.env.PORT || 5002;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`✅ Product Service running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Failed to start Product Service:", error);
  }
})();
