import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import ticketRoutes from "./src/routes/ticket.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Connected to DB"))
  .catch((err) => {
    console.log("err:", err);
  });

app.use(ticketRoutes);
app.use(userRoutes);

app.use((req, res) => {
  return res.status(404).json({ status: "Endpoint does not exist" });
});

app.listen(process.env.PORT, () => {
  console.log(`Express started on http://localhost:${process.env.PORT}`);
});
