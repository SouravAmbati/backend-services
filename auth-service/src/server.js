import "dotenv/config";
import { connectDB } from "./config/mongodb.js";
import app from "./index.js";

const PORT = Number(process.env.PORT) || 5001;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`✅ Auth Service running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
});
