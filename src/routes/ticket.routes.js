import express from "express";
import {
  GET_ALL_TICKETS,
  GET_TICKET_BY_ID,
  INSERT_TICKET,
  UPDATE_TICKET_BY_ID,
  BUY_TICKET,
  REFUND_TICKET,
} from "../controllers/ticket.controller.js";
import { validateData } from "../middlewares/validate_schema.js";
import { ticketSchema } from "../utils/validations/schemes/ticket.schema.js";
import auth from "../middlewares/authorization.js";

const router = express.Router();

router.get("/tickets", auth, GET_ALL_TICKETS);

router.get("/tickets/:id", auth, GET_TICKET_BY_ID);

router.post("/tickets", validateData(ticketSchema), auth, INSERT_TICKET);

router.put("/tickets/purchase", auth, BUY_TICKET);

router.put("/tickets/:ticketId/users/:usersId", auth, REFUND_TICKET);

router.put("/tickets/:id", auth, UPDATE_TICKET_BY_ID);

export default router;
