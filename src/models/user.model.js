import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  user_id: { type: String, required: true },
  createdDate: { type: Date, required: false },
  name: { type: String, required: true, min: 3 },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bought_tickets: { type: Array, required: false },
  money_balance: { type: Number, required: true },
});

const UserModel = mongoose.model("ticket_users", userSchema);

export { UserModel };
