import express from "express";
// import cors from "cors";
import helmet from "helmet";
import orderRouter from "./src/routes/orderRoute.js";

const app = express();

// app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true, service: "cart-service" }));

app.use("/api/order", orderRouter);

export default app;
