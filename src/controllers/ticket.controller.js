import { TicketModel } from "../models/ticket.model.js";
import { UserModel } from "../models/user.model.js";
import {
  calcUserMoneyBalancePurchase,
  calcUserMoneyBalanceRefund,
} from "../utils/helpers/calc_money_balance.js";
import { findUser } from "../middlewares/find_user.js";
import { findTicket } from "../middlewares/find_ticket.js";
import { updateUser } from "../middlewares/updated_user.js";
import { alphabeticalSorting } from "../utils/helpers/alphabetical_sorting.js";
import jwt from "jsonwebtoken";

const GET_ALL_TICKETS = async (req, res) => {
  try {
    const tickets = await TicketModel.find();

    if (!tickets.length) {
      return res.status(404).json({ message: "Data not exist" });
    }

    const sortedTickets = alphabeticalSorting(tickets);

    return res.json({ ticketList: sortedTickets });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const GET_TICKET_BY_ID = async (req, res) => {
  try {
    const findTicket = await TicketModel.findOne({ ticket_id: req.params.id });

    if (!findTicket) {
      return res.status(400).json({
        message: `The entered ID (${req.params.id}) does not exist. Please try entering a different ID.`,
      });
    }

    return res.json(findTicket);
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const INSERT_TICKET = async (req, res) => {
  try {
    const ticket = new TicketModel({
      ...req.body,
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

const UPDATE_TICKET_BY_ID = async (req, res) => {
  try {
    const jwtToken = req.headers.authorization;

    jwt.verify(jwtToken, process.env.JWT_KEY, async (err, decoded) => {
      if (err) {
        return res.status(400).json({
          message: "Your time has expired, you must log in again",
        });
      }

      const user_id = decoded.user_id;

      const isUserTicket = await TicketModel.findOne({ userId: user_id });

      if (!isUserTicket) {
        return res.status(404).json({
          message: `You are not authorized to update ticket with this ID (${req.params.id})`,
        });
      }

      const updateTicket = await TicketModel.findOneAndUpdate(
        { ticket_id: req.params.id },
        { ...req.body },
        { new: true }
      );

      if (!updateTicket) {
        return res.status(404).json({
          message: `Ticket with ID (${req.params.id}) was not found`,
        });
      }

      return res.status(200).json({
        message: `Ticket with ID (${req.params.id}) was successfully updated`,
        updatedTicket: updateTicket,
      });
    });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const BUY_TICKET = async (req, res) => {
  try {
    const user = await findUser(req.body.user_id);

    if (!user) {
      return res.status(404).json({
        message: `User with this ID (${req.body.user_id}) does not exist`,
      });
    }

    const ticket = await findTicket(req.body.ticket_id);

    if (!ticket) {
      return res.status(404).json({
        message: `Ticket with this ID (${req.body.ticket_id}) does not exist`,
      });
    }

    if (user.bought_tickets.includes(req.body.ticket_id)) {
      return res.status(400).json({
        message: `Ticket with this ID (${req.body.ticket_id}) has already been purchased by the user`,
      });
    }

    let updatedBalance;
    try {
      updatedBalance = calcUserMoneyBalancePurchase(user, ticket);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const updatedUser = await updateUser(
      user._id,
      updatedBalance,
      req.body.ticket_id
    );

    return res.status(201).json({
      message: `The ticket which cost ${ticket.ticket_price}€  was purchased successfully, your money balance changed from ${user.money_balance}€ to ${updatedBalance}€`,
      updatedUser,
    });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const REFUND_TICKET = async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const userId = req.params.usersId;

    const findUser = await UserModel.findOne({ user_id: userId });

    if (!findUser) {
      return res.status(404).json({
        message: `User with this ID (${userId}) does not exist`,
      });
    }

    const findTicket = await TicketModel.findOne({
      ticket_id: ticketId,
    });

    if (!findTicket) {
      return res.status(404).json({
        message: `Ticket with this ID (${ticketId}) does not exist`,
      });
    }

    const userMoneyBalance = calcUserMoneyBalanceRefund(findUser, findTicket);

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { money_balance: userMoneyBalance, $pull: { bought_tickets: ticketId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: `Ticket with ID (${ticketId}) not found`,
      });
    }

    return res.json({
      message: `The ticket which cost ${findTicket.ticket_price}€ was successfully refunded, your money balance changed from ${findUser.money_balance}€ to ${userMoneyBalance}€`,
      updatedUser,
    });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const DELETE_TICKET_BY_ID = async (req, res) => {
  try {
    const ticket = await TicketModel.findOne({ ticket_id: req.params.id });

    console.log(ticket);

    if (!ticket) {
      return res.status(401).json({
        message: `Ticket with this ID (${req.params.id}) does not exist`,
      });
    }

    const response = await TicketModel.deleteOne({ ticket_id: req.params.id });

    return res.status(200).json({
      message: `Ticket with ID (${req.params.id}) was deleted`,
      response: response,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export {
  GET_ALL_TICKETS,
  GET_TICKET_BY_ID,
  INSERT_TICKET,
  UPDATE_TICKET_BY_ID,
  BUY_TICKET,
  REFUND_TICKET,
  DELETE_TICKET_BY_ID,
};
