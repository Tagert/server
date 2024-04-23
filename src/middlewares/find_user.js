import { UserModel } from "../models/user.model.js";

const findUser = async (userId) => {
  return await UserModel.findOne({ user_id: userId });
};

export { findUser };
