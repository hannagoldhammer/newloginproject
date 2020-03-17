const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const userSchema = new Schema({
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true, minlength: 5 },
    resetToken: String,
    expirationToken: Date,
    wishList: [{
        productId: {type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
        }
    }]
})

userSchema.methods.addToWishList = function(product){
    this.wishList.push({productId: product._id});
    return this.save();
}

// Mongoose kommer att skapa ett schema som heter User i databasen.
const User = mongoose.model("User", userSchema);

module.exports = User;