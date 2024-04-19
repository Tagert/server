import { UserModel } from "../models/user.model.js";
import { toUpperCase } from "../utils/helpers/to_upper_case.js";
import { validatePassword } from "../utils/validations/validate_password.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SIGN_UP = async (req, res) => {
  try {
    const lithuanianDate = new Date().toLocaleString("lt-LT");

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const passwordValidation = validatePassword(req.body.password);

    if (passwordValidation !== true) {
      return res.status(400).json({ error: passwordValidation });
    }

    const user = new UserModel({
      createdDate: lithuanianDate,
      name: req.body.name,
      email: req.body.email,
      password: hash,
      real_estates: [],
      money_balance: req.body.money_balance,
    });
    const changeToUpperCase = toUpperCase(user.name);

    user.user_id = user._id.toString();
    user.name = changeToUpperCase;

    const response = await user.save();

    const jwt_token = jwt.sign(
      { email: user.email, user_id: user.id },
      process.env.JWT_KEY,
      { expiresIn: "2h" }
    );

    const jwt_refresh_token = jwt.sign(
      { email: user.email, user_id: user.id },
      process.env.REFRESH_JWT_KEY,
      { expiresIn: "24h" }
    );

    return res.status(201).json({
      response: response,
      message: `User (${req.body.email}) was added successfully`,
      jwt_token: jwt_token,
      jwt_refresh_token: jwt_refresh_token,
    });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const LOG_IN = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Unrecognized username or password" });
    }

    const isPasswordMatch = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isPasswordMatch) {
      return res
        .status(404)
        .json({ message: "Unrecognized username or password" });
    }

    const jwt_token = jwt.sign(
      { email: user.email, user_id: user.id },
      process.env.JWT_KEY,
      { expiresIn: "2h" }
    );

    const jwt_refresh_token = jwt.sign(
      { email: user.email, user_id: user.id },
      process.env.REFRESH_JWT_KEY,
      { expiresIn: "24h" }
    );

    return res.status(201).json({
      status: `User (${user.email}) have been logged successfully in `,
      jwt_token: jwt_token,
      jwt_refresh_token: jwt_refresh_token,
    });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const REFRESH_TOKEN = async (req, res) => {
  const jwtRefreshToken = req.body.jwt_refresh_token;

  try {
    if (!jwtRefreshToken) {
      return res.status(400).json({
        message:
          "Unable to find, please provide a refresh token to perform further actions",
      });
    }

    jwt.verify(jwtRefreshToken, process.env.REFRESH_JWT_KEY, (err, decoded) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "Your time has expired, you must log in again" });
      }

      const user_id = decoded.user_id;
      const email = decoded.email;

      const jwtToken = jwt.sign({ email, user_id }, process.env.JWT_KEY, {
        expiresIn: "2h",
      });

      return res.status(200).json({
        jwt_token: jwtToken,
        jwt_refresh_token: jwtRefreshToken,
        message: "User Logged back successfully",
      });
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const GET_ALL_USERS = async (req, res) => {
  try {
    const users = await UserModel.find();

    if (!users.length) {
      return res.status(404).json({ message: "Data not exist" });
    }

    const sortedUsers = users.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });

    return res.json({ usersList: sortedUsers });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const GET_USER_BY_ID = async (req, res) => {
  try {
    const findUser = await UserModel.findOne({ user_id: req.params.id });

    if (!findUser) {
      return res.status(404).json({
        message: `The entered user with ID (${req.params.id}) does not exist. Please try entering a different ID.`,
      });
    }

    return res.json(findUser);
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const GET_USER_BY_ID_WITH_TICKETS = async (req, res) => {
  try {
    const findUser = await UserModel.findOne({
      user_id: req.params.userId,
    });

    if (!findUser) {
      return res.status(404).json({
        message: `The entered user with ID (${req.params.userId}) does not exist. Please try entering a different ID. test`,
      });
    }

    const userByIdWithTickets = await UserModel.aggregate([
      {
        $match: {
          user_id: findUser.user_id,
        },
      },
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "ticket_id",
          as: "user_tickets",
        },
      },
    ]).exec();

    return res.json(userByIdWithTickets[0]);
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export {
  SIGN_UP,
  LOG_IN,
  REFRESH_TOKEN,
  GET_ALL_USERS,
  GET_USER_BY_ID,
  GET_USER_BY_ID_WITH_TICKETS,
};
