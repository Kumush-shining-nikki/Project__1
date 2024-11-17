const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken")
const { newsModel } = require("../models/news.model")

exports.getAllUser = async (req, res) => {
  try {
    const users = await userModel.find()
    const token = req.cookies.token
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const userId = req.cookies.userId

    res.render("admin-page", {
      token,
      users,
      user,
      userId,
    })
  } catch (error) {
    console.log(error);
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id
  try {
    const user = await userModel.findById(id)
    if (user._id != req.cookies.userId) {
      await newsModel.deleteMany({ author: user })
      await userModel.findByIdAndDelete(id)
    }
    return res.redirect("/api/users")
  } catch (error) {
    console.log(error);
  }
}