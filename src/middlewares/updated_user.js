import { UserModel } from "../models/user.model.js";

const updateUser = async (userId, newBalance, ticketId) => {
  return await UserModel.findByIdAndUpdate(
    userId,
    {
      money_balance: newBalance,
      $push: { bought_tickets: ticketId },
    },
    { new: true }
  );
};

export { updateUser };
