import express from "express";
// import cors from "cors";
import helmet from "helmet";
import router from "./routes/authRoute.js";

const app = express();

// app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true, service: "auth-service" }));

// Register routes
app.use("/api/auth", router);

export default app;
