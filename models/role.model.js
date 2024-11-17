const mongoose = require("mongoose")

const Role = new mongoose.Schema({
    value: {type: String, unique: true, default: "USER"}
})

const roleModel = mongoose.model("Role", Role)
module.exports = roleModel