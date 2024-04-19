import mongoose from "mongoose";

const validateEmail = (email) => {
  const em = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return em.test(email);
};

const userSchema = mongoose.Schema({
  user_id: { type: String, required: true },
  createdDate: { type: Date, required: false },
  name: { type: String, required: true, min: 3 },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
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
