const express = require("express");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");
const router = express.Router();
const verifyToken = require("./verifyToken");
const config = require("../config/config");
const nodeMailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const resetPasswordSchema = require("../model/resetPassword")


const transport = nodeMailer.createTransport(sendGridTransport({
    auth: {
        api_key: config.mail
    }
}))

router.route("/")
    .get(async (req, res) => {
        res.send("Hej, du lyckades att logga in")
    })

router.route("/signUp")
    .get(async (req, res) => {
        res.render("signup");
    })

    .post(async (req, res) => {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        // Req.body har all datan som skickas in till databasen
        // Här sparar vi alla nya kunder 
        const newRegisterdUser = await new User({ email: req.body.email, password: hashPassword }).save();

        transport.sendMail({
            to: "hanna.goldhammer@medieinstitutet.se",
            from: "<no-reply@authtesting.se>",
            subject: "Login succedded",
            html: "<h1>Välkommen " + newRegisterdUser.email + "</h1>"
        })

        // Den söker efter den emailen som jag har skrivit in i inputfältet, alltså bara en.
        // const findUser = await User.findOne({ email: req.body.email })

        res.send("You have been registered");
        // När en användare signar upp sig så kommer man att redirectas till startsidan.
        // res.redirect("/")
    })

router.route("/login")
    .get(async (req, res) => {
        // Avnändares info
        res.render("login");

    })
    // Jämföra med databas
    .post(async (req, res) => {
        // Kolla förs om anvöndaren finns. 
        const checkUser = await User.findOne({ email: req.body.loginEmail })

        // Kolla om användarnamnet finns, annars skicka användaren till sing up sidan
        if (!checkUser) res.redirect("/login")

        const validUser = await bcrypt.compare(req.body.loginPassword, checkUser.password)

        if (!validUser) return res.redirect("/login");

        // Payload = användares information
        jsonWebToken.sign({ checkUser }, "secretKey", (err, token) => {
            if (err) {
                res.redirect("/login")
            }
            if (token) {
                // Cookies finns i req objektet
                // jwt kan vara vad som helst 
                const cookie = req.cookies.jsonWebToken
                // Kollar om användaren har en cookie sedan innan, om inte, skapa en till användaren. 
                if (!cookie) {
                    // res.cookie skapear en cookie till klienten
                    // maxAge för hur länge som den ska gälla
                    res.cookie("jsonWebToken", token, { maxAge: 6000000000, httpOnly: true })  // jwt här måste vara samma som req.cookies.jwt

                }
                // Local storage 
                // Node js kör i servern och localstorage är browser api
                // localStorage.setItem("JsonWebToken", JSON.stringify(token))
                res.render("userProfile", { checkUser, token });
            }
            res.redirect("/login");
        })
    })

router.route("/reset")
    .get(async (req, res) => {
        res.render("reset");
    })
    .post(async (req, res) => {
        // Kolla om kunden existerar i databsen
        const existUser = await User.findOne({ email: req.body.resetMail });
        if (!existUser) return res.redirect("/signup");

        crypto.randomBytes(32, async (err, token) => {
            if (err) return res.redirect("/signup");
            // Gör om token till hex
            const resetToken = token.toString("hex");

            existUser.resetToken = resetToken;
            // 100000 = så lång tid sosm länken är giltig
            existUser.expirationToken = Date.now() + 100000;
            await existUser.save();

            await transport.sendMail({
                to: existUser.email,
                from: "<no-reply@authtesting.se>",
                subject: "reset password",
                html: ` <p>Reset password link: <a href="http://localhost:8001/reset/${resetToken}">Klicka här</a>  </p>`
            })
        })
        res.send("Vi har nu skickat ett mail till dig så att du kan återställa ditt lösenord.");
    })

router.route("/reset/:token")
    .get(async (req, res) => {
        // om användaren har en giltig token så ska användaren komma till ett formulär där man kan fylla i sitt nya lösenord
        const resetUser = await User.findOne({ resetToken: req.params.token, expirationToken: { $gt: Date.now() } });
        if (!resetUser) return res.redirect("/signup");
        res.render("resetForm", { resetUser });
    })
    .post(async (req, res) => {
        // målet är att vi ska plocka det nya lösenordet från resetForm och ersätta det gamla lösenordet som ligger i databasen 
        const hashedResetedPassword = await User.findOne({ _id: req.body.userId });

        hashedResetedPassword.password = await bcrypt.hash(req.body.password, 10);
        hashedResetedPassword.resetToken = undefined;
        hashedResetedPassword.expirationToken = undefined;
        await hashedResetedPassword.save();

        res.redirect("/login");
    })

router.get("/products", verifyToken, (req, res) => {
    res.send("You have authorisation");
});

router.route("/logout")
    .get((req, res) => {
        // För att ta bort cookies. 
        res.clearCookie("jsonWebToken").redirect("/login")
    })

router.get("/wishlist/:id", verifyToken, async (req, res) => {

    //req.params.id

    const product = await Product.findOne({ _id: req.params.id })

    // req.user ska ha user inf
    //req.body.user._id
    //verifyToken

    //hård kodat user id från user collection. // Jag har ändrat
        const user = await User.findOne({ _id: req.body.user._id })
    //user hämtar bara ett objekt. 
    //User.find() hämtar array of object 

    await user.addToWishList(product)

    // await user.save()

    res.send("wishlisted");

})

module.exports = router;