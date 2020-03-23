const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const userSchema = new Schema({
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true, minlength: 5 },
    resetToken: String,
    expirationToken: Date,
    // denna listan har ett embeded objekt
    wishlist: [{
        // productId = innehåller all info om produkten 
        // productId = är inte unikt!det vanliga id är det.
        productId: {type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
        }
    }]
})

userSchema.methods.addToWishList = function(product){
    this.wishlist.push({productId: product._id});

    // Objekct destructuring, array destructuring 
    const newWishlist = this.wishlist.filter(function({productId}){
        // Kollar på om array inte har detta productId, om den inte har så så ska den lägga till det i arrayn
        return !this.has(`${productId}`) && this.add(`${productId}`)
        // Skapar ny array. Pga new Set så kan man använda has och add metoden
    }, new Set)
    console.log(newWishlist)
    // Kopiera arrayn och lägger till objectet 
    // ... = kopiera. ECMA script. Man kan göra såhär för att man inte vill att den gamla listan ska påverkas. 
    this.wishlist = [...newWishlist]
    
    return this.save();

}

// Tar bort data från productId array
// Product är varje enskild product i varje loop 
userSchema.methods.removeFromList = function(productId) {
    const restOfTheProducts = this.wishlist.filter(product=> 
        product.productId.toString() !== productId.toString());
	this.wishlist = restOfTheProducts;
	return this.save();
}

// Mongoose kommer att skapa ett schema som heter User i databasen.
const User = mongoose.model("User", userSchema);

module.exports = User;