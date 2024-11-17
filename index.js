const express = require("express");
const app = express();
const { connectMongodb } = require("./database/connect.js");
const router = require("./routes.js");
const Handlebars = require("handlebars")
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access")
const { create } = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const flash = require("connect-flash")
const session = require("express-session")
const path = require("path")

connectMongodb();

const hbs = create({ defaultLayout: "main", extname: "hbs", handlebars: allowInsecurePrototypeAccess(Handlebars) });

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./public/views");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(cookieParser())
app.use(session({ secret: "Admin", resave: false, saveUninitialized: false,}))
app.use(flash())
app.use('/api/lib', express.static(path.join(__dirname, 'lib')));
app.use('/api/css', express.static(path.join(__dirname, 'css')));

app.use("/api", router);

app.use((req, res, next) => {
  res.redirect('/api');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
