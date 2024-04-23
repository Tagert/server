import Joi from "joi";

const ticketSchema = Joi.object({
  title: Joi.string().required(),
  from_location: Joi.string().required(),
  to_location: Joi.string().required(),
  to_location_photo_url: Joi.string().required(),
  ticket_price: Joi.number().required(),
});

export { ticketSchema };
