const mongoose = require("mongoose")

const newsSchema = new mongoose.Schema({
    newsId: {type: mongoose.Schema.Types.ObjectId},
    title: {type: String, required: true},
    content: {type: String, required: true},
    image: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true},
    createdAt: {type: String, required: true},
    updatedAt: {type: String}
})

exports.newsModel = mongoose.model("News", newsSchema)