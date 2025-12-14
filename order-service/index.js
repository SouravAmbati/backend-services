import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./src/config/mongodb.js";

const PORT = Number(process.env.PORT) || 5004;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`✅ Cart Service running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("❌ Failed to start Cart Service:", err);
});
