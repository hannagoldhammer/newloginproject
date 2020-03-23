const mongoose = require("mongoose");

const productSchema = {
    name: {type: String, required: true},
    price: {type: String , required: true},
    description: {type: String},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"     // ref referear från vilken model den ska leta objectId från
    }
}

const product = mongoose.model("Product", productSchema);

module.exports = product;