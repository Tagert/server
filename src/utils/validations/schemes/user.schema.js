import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  bought_tickets: Joi.array(),
  money_balance: Joi.number().required(),
});

export { userSchema };
