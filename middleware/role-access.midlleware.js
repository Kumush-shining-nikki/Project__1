const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config()

exports.roleAccessMiddleware = function (roles) {
  return async function (req, res, next) {
    
    try {
      const token = req.cookies.token
      if (!token) {
        res.redirect("/api/login")
      }

      const { roles: userRoles } = await jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
      );

      let checkRole = false;
      userRoles.forEach(role => {
        if (roles.includes(role)) {
          checkRole = true;
        }
      });

      if (!checkRole) {
        return res.status(400).send({
          message: "You're not admin",
        });
      }

      next()
      
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Internal server error!",
      });
    }
  };
};
