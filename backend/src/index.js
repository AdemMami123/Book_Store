import express from "express";
import "dotenv/config";
import destinationRoutes from "../routes/destinationRoutes.js";

import authRoutes from "../routes/authRoutes.js";
import { connectDB } from "../lib/db.js";
import cors from "cors";
import job from "../lib/cron.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
job.start(); // Start the cron job

//routes
app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
