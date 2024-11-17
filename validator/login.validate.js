const Joi = require("joi")

exports.loginSchema = Joi.object({
    username: Joi.string().required().messages({
        "string.base": "Foydalanuvchi nomi string bo'lishi kerak!",
        "string.empty": "Foydalanuvchi nomi bo'sh bo'lmasligi kerak!",
        "any.required": "Foydalanuvchi nomi talab qilinadi",
    }),
    password: Joi.string().min(8).required().messages({
        "string.base": "Parol string bo'lishi kerak!",
        "string.empty": "Parol bo'sh bo'lishi kerak emas!",
        "string.min": "Parol 8 ta dan kam bo'lmasligi kerak!",
        "string.max": "Parol 32 ta dan ko'p bo'lmasligi kerak!",
        "any.required": "Parol talab qilinadi",
    })
})