const express = require("express")
const mongoose = require("mongoose")
const config = require("./config/config")
const user = require("./router/userRouter")
const cookieParser = require("cookie-parser");
const productRouter = require("./router/productRouter");
// Denna gör så att man kan läsa data från en .env fil
require("dotenv").config();

const app = express()

// Med hjälp av denna så kan den läsa cookies
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

// Att nodeska använda views och ejs för att rendera html filerna 
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.send("Welcome user")
})

app.use(user);
app.use(productRouter);

const option = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}

// PORT= ska vara sttora bokstäver för att protokollet säger så
const port = process.env.PORT || 8001;
mongoose.connect(config.databaseURL, option).then(() => {
    app.listen(port)
    console.log(`Connected to port: ${port}`);
});

module.exports = app;