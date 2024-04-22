import jwt from "jsonwebtoken";

const generateJwToken = (userId, email) => {
  const jwt_token = jwt.sign(
    {
      userId: userId,
      email: email,
    },
    process.env.JWT_KEY,
    { expiresIn: "2h" }
  );

  return jwt_token;
};

const generateRefreshToken = (userId, email) => {
  const refresh_token = jwt.sign(
    {
      userId: userId,
      email: email,
    },
    process.env.REFRESH_JWT_KEY,
    { expiresIn: "24h" }
  );

  return refresh_token;
};

export { generateJwToken, generateRefreshToken };
