const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId},
    username: {type: String, required: true, unique: true, minlength: 3, maxlength: 20},
    password: {type: String, required: true, minlength: 8,},
    email: {type: String, required: true, unique: true},
    avatar: {type: String, default: "https://cdn-icons-png.flaticon.com/512/3607/3607444.png"},
    createdAt: {type: Date, default: Date.now},
    roles: [{type: String, ref: "Role", default: ["USER"]}]
})

const userModel = mongoose.model("User", userSchema)
module.exports = userModel