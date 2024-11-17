const { default: mongoose } = require("mongoose");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const roleModel = require("../models/role.model");
const { newsModel } = require("../models/news.model");
const dotenv = require("dotenv").config();
const flash = require("connect-flash");
const { registerSchema } = require("../validator/register.validate");
const { loginSchema } = require("../validator/login.validate");

const generateAccessToken = ( id, roles) => {
  const payload = { id, roles };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
};

exports.registerPage = async (req, res) => {

  res.render("register", {
    registerError: req.flash('registerError'),
  });
};

exports.register = async (req, res) => {
  try {
    const { value, error } = registerSchema.validate(req.body)

    if(error) {
      if(error.details) {
        const errMsg = error.details[0].message
        req.flash("registerError", errMsg)
        return res.redirect("/api/register")

      } else {
        throw error;
      }
    }

    const userRole = await roleModel.findOne({ value: "USER" });
    
    const passwordHash = await bcrypt.hash(value.password, 10);    

    const existUser = await userModel.findOne({username: value.username});

    if (existUser) {
      req.flash("registerError", "Bunda foydalanuvchi alaqachon ro'yxatdan o'tgan!")
      return res.redirect("/api/register")
    }

    
    const userData = {
      username: value.username,
      email: value.email,
      password: passwordHash,
      avatar: req.body.avatar,
      roles: [userRole.value],
    };
    
    const user = await userModel.create(userData);
    res.redirect("/api/login")
    
  } catch (error) {
    console.log(error);
    return res.status(500).redirect("/api/500")
  }
};

exports.login = async (req, res) => {

  try {
    const { value, error } = loginSchema.validate(req.body)

    if(error) {
      if(error.details) {
        const errMsg = error.details[0].message
        req.flash("loginError", errMsg)
        return res.redirect("/api/login")

      } else {
        throw error;
      }
    }
    
    const existUser = await userModel.findOne({username: value.username});
    console.log(existUser)

      if (!existUser) {
        req.flash('loginError', 'Bunday foydalanuvchi topilmadi!')
        return res.redirect("/api/login")
      }

      const checkPass = await bcrypt.compare(
        value.password,
        existUser.password
      );

      if (!checkPass) {
        req.flash('loginError', 'Parol xato!')
        return res.redirect("/api/login")
      }

      const token = generateAccessToken(existUser._id, existUser.roles);

      console.log(token);
      
      res.cookie("token", token, {secure: true})
      res.cookie("userId", existUser._id, {secure: true})
    
      return res.redirect("/api"); 
    
  } catch (error) {
    console.log(error);
    return res.status(500).redirect("/api/500")
  }
};

exports.loginPage = async (req, res) => {
  res.render("login", {
    token: res.cookie.token,
    loginError: req.flash('loginError')
  });
};

exports.logOut = (req, res) => {
  
  res.clearCookie("token")
  res.clearCookie("userId")

  res.redirect("/api")
}

exports.userProfile =  async (req, res) => {
  const { params: { id } } = req
  console.log(id);
  const token = req.cookies.token
  try {
    const user = await userModel.findById(id);
    console.log(user);

    const userId = req.cookies.userId
    res.render("profile", {
      user,
      userId,
      token,
    })

    await userModel.findById(id);
  } catch (error) {
    console.log(error);
    return res.status(500).redirect("/api/500")
  }
};

exports.getOneUser = async (req, res) => {
  const id = req.params.id
  console.log(id);
  const token = req.cookies.token
  try {
    const author = await userModel.findById(id)
    const userId = req.cookies.userId
    const user = await userModel.findById(userId);

    res.render("one-user", {
      user,
      userId,
      token,
      author
    })

  } catch (error) {
    console.log(error);
    return res.status(500).redirect("/api/500")
  }
};

exports.updateProfilePage = async (req, res) => {
  const userId = req.cookies.userId
  const token = req.cookies.token
  const user = await userModel.findById(userId)
  res.render("update-profile", {
    user,
    userId,
    token
  })
}

exports.updateProfile = async (req, res) => {
  try {
    const { body, params: { id } } = req
    const updateProfile = body
    const newPassword = body;
    const oldProfile = await userModel.findById(id)

    const passwordHash = await bcrypt.hash(newPassword.password, 10);

  
    const profile = {
      username: updateProfile.username,
      email: updateProfile.email || oldProfile.email, 
      password: passwordHash || oldProfile.password,
      avatar: updateProfile.avatar || oldProfile.avatar,
    };
  
    await userModel.findByIdAndUpdate(id, profile)
    res.redirect(`/api/profile/${id}`)
  } catch (error) {
    console.log(error);
    return res.status(500).redirect("/api/500")
  }
}

exports.Contact = async (req, res) => {
  const token = req.cookies.token
  res.render("contact", {
    token
  })
}