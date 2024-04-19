import express from "express";

import {
  SIGN_UP,
  LOG_IN,
  REFRESH_TOKEN,
  GET_ALL_USERS,
  GET_USER_BY_ID,
  GET_USER_BY_ID_WITH_TICKETS,
} from "../controllers/user.controller.js";
import auth from "../middlewares/authorization.js";

const router = express.Router();

router.post("/users/sign_up", SIGN_UP);

router.post("/users/login", LOG_IN);

router.get("/users", auth, GET_ALL_USERS);

router.get("/users/:id", auth, GET_USER_BY_ID);

router.get("/users/:userId/tickets", auth, GET_USER_BY_ID_WITH_TICKETS);

router.post("/token/refresh", REFRESH_TOKEN);

export default router;
