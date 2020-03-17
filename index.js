const express = require("express")
const mongoose = require("mongoose")
const config = require("./config/config")
const user = require("./router/userRouter")
const cookieParser = require("cookie-parser");
const productRouter = require("./router/productRouter");

const app = express()

// Med hjälp av denna så kan den läsa cookies
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

// Att nodeska använda views och ejs för att rendera html filerna 
app.set("view engine", "ejs");

// Behövde inte använda
// app.get("/", (req, res) => {
//     res.send("It is working!")
// });

app.use(user);
app.use(productRouter);

const option = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}

const port = process.env.PORT || 8001;
mongoose.connect(config.databaseURL, option).then(() => {
    app.listen(port)
    console.log(`Connected to port: ${port}`);
})