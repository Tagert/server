import express from "express";
import { INSERT_TICKET, BUY_TICKET } from "../controllers/ticket.controller.js";
import auth from "../middlewares/authorization.js";

const router = express.Router();

router.post("/tickets", auth, INSERT_TICKET);

router.put("/tickets/purchase", auth, BUY_TICKET);

export default router;
