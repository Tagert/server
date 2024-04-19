import { ticketModel } from "../models/ticket.model.js";
import { UserModel } from "../models/user.model.js";
import { calcUserMoneyBalance } from "../utils/helpers/calc_money_balance.js";

const INSERT_TICKET = async (req, res) => {
  try {
    const ticket = new ticketModel({
      id: req.body.id,
      title: req.body.title,
      from_location: req.body.from_location,
      to_location: req.body.to_location,
      to_location_photo_url: req.body.to_location_photo_url,
      ticket_price: req.body.ticket_price,
      userId: req.body.userId,
    });
    ticket.ticket_id = ticket._id.toString();

    const response = await ticket.save();

    return res.status(201).json({
      response: response,
      message: `Ticket of ${req.body.title} was added successfully`,
    });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const BUY_TICKET = async (req, res) => {
  try {
    const findUser = await UserModel.findOne({ user_id: req.body.user_id });

    console.log(findUser);

    if (!findUser) {
      return res.status(404).json({
        message: `User with this ID (${req.body.user_id}) does not exist`,
      });
    }

    const findTicket = await ticketModel.findOne({
      ticket_id: req.body.ticket_id,
    });

    if (!findTicket) {
      return res.status(404).json({
        message: `Ticket with this ID (${req.body.ticket_id}) does not exist`,
      });
    }

    if (findUser.bought_tickets.includes(req.body.ticket_id)) {
      return res.status(400).json({
        message: `Ticket with this ID (${req.body.ticket_id}) has already been purchased by the user`,
      });
    }

    const userMoneyBalance = calcUserMoneyBalance(findUser, findTicket);

    await UserModel.findByIdAndUpdate(req.body.user_id, {
      money_balance: userMoneyBalance,
      $push: { bought_tickets: req.body.ticket_id },
    });

    return res.status(201).json({ status: "Ticket purchased successfully" });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export { INSERT_TICKET, BUY_TICKET };
