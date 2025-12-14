import "dotenv/config";
import { connectDB } from "./config/mongodb.js";
import app from "./app.js";

const PORT = Number(process.env.PORT) || 5003;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`✅ Cart Service running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("❌ Failed to start Cart Service:", err);
});
