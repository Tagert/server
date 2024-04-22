import express from "express";
import {
  GET_ALL_TICKETS,
  INSERT_TICKET,
  UPDATE_TICKET_BY_ID,
  BUY_TICKET,
  REFUND_TICKET,
} from "../controllers/ticket.controller.js";
import auth from "../middlewares/authorization.js";

const router = express.Router();

router.get("/tickets", auth, GET_ALL_TICKETS);

router.post("/tickets", auth, INSERT_TICKET);

router.put("/tickets/purchase", auth, BUY_TICKET);

router.put("/tickets/:ticketId/users/:usersId", auth, REFUND_TICKET);

router.put("/tickets/:id", auth, UPDATE_TICKET_BY_ID);

export default router;
