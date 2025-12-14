import express from "express";
// import cors from "cors";
import helmet from "helmet";
import cartRouter from "./routes/cartRoutes.js";



const app = express();

// app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true, service: "cart-service" }));

app.use("/api/cart", cartRouter);

export default app;
