import express from "express";
// import cors from "cors";
import helmet from "helmet";
import productRoutes from "./routes/productRoutes.js";

const app = express();

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
//   allowedHeaders: ["Content-Type", "Authorization", "token"]
// }));

app.use(helmet());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/health", (_req, res) => res.json({ ok: true, service: "product-service" }));

app.use("/api/products", productRoutes);

export default app;
