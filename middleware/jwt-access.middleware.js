const { verify } = require("jsonwebtoken");
const dotenv = require("dotenv").config()

exports.jwtAccessMiddlewarre = function (req, res, next) {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.redirect("/api/login")
    }

    const user = verify(token, process.env.JWT_SECRET_KEY);

    req.user = user;

    next();
  } catch (error) {
    console.log(error);

    if (error.stack.includes("JsonWebTokenError")) {
      return res.status(400).send({
        message: "Invalid token!",
      });
    }

    return res.status(500).send({
        message: "Internal server error!"
    })
  }
};
