const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
try {
  exports.connectMongodb = async function () {
    // const mongodbPass = process.env.MONGODB_PASS;
    const url = `mongodb+srv://Narimon:1977NISH@news.epe25.mongodb.net/?retryWrites=true&w=majority&appName=News`;
    await mongoose
      .connect(url, {})
      .then(() => {
        console.log("Mongodb connect succsesfull");
      })
      .catch((err) => {
        console.log(err);
      });
  };
} catch (error) {
  console.log(error);
}
