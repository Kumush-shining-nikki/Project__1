const Joi = require("joi")

exports.newsSchema = Joi.object({
    title: Joi.string().min(10).max(255).required().messages({
        "string.base": "Sarlavha string bo'lishi kerak!",
        "string.empty": "Sarlavha bo'sh bo'lmasligi kerak!",
        "string.min": "Sarlavha kamida 10 ta belgidan kam bo'lmasligi kerak!",
        "string.max": "Sarlavha 255 ta belgidan ko'p bo'lmasligi kerak!",
        "any.required": "Title talab qilinadi!"
    }),
    content: Joi.string().min(200).required().messages({
        "string.base": "Yangilik mazmuni string bo'lishi kerak!",
        "string.empty": "Yangilik mazmuni bo'sh bo'lmasligi kerak!",
        "string.min": "Yangilik mazmuni 100 ta belgidan kam bo'lmasligi kerak!",
        "any.required": "Yangilik mazmuni bo'lishi shart!",
    }),
    image: Joi.string().required().messages({
        "string.base": "Rasm url bo'lishi shart!",
        "string.empty": "Rasm bo'sh bo'lmasligi kerak!",
        "any.required": "Rasm bo'lishi shart!"
    }),
    category: Joi.string().required().messages({
        "string.base": "Yangiliklar turi string bo'lishi shart!",
        "string.empty": "Yangiliklar turi bo'sh bo'lmasligi shart!",
        "any.required": "Yangiliklar turini tanlashingiz shart!"
    })
})