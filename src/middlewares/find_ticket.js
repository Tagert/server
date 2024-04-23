import { TicketModel } from "../models/ticket.model.js";

const findTicket = async (ticketId) => {
  return await TicketModel.findOne({ ticket_id: ticketId });
};

export { findTicket };
