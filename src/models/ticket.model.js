import mongoose from "mongoose";

const ticketSchema = mongoose.Schema({
  ticket_id: { type: String, required: true },
  title: { type: String, required: true, min: 3 },
  from_location: { type: String, required: true, min: 3 },
  to_location: { type: String, required: true, min: 3 },
  to_location_photo_url: { type: String, required: true, min: 3 },
  ticket_price: { type: Number, required: true, min: 3 },
  userId: { type: String, required: true },
});

const ticketModel = mongoose.model("tickets", ticketSchema);

export { ticketModel };
