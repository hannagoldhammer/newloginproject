// Kommer att kolla om en användare finns eller inte 

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.cookies.jsonWebToken;

    
    // Kolla om användare har - req.cookies.jsonwebtoken. Om den har det så ska vi gå vidare till nästa steg. Denna delen kräver npm cookie-parser
    if(token){
        // "secretKey" ska heta samma som inom sign på userRouter
        // Decode token och user 
        // För att kolla om användaren har en valid cookie
        const user = jwt.verify(token, "secretKey");
        // user innehåller användanman och lösenord
        console.log("user info" + user);
        // Tilldelat den decodade informationen till req
        // Varför vill man göra detta? // Pappa
        req.body = user;
        next();
    }else {
        res.send("You are not authorised.");
    }
    
    // jwt verifiering metod för att kolla om det är en vaild cookie
    // validering data till server 

    // next()
}