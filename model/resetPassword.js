const resetPasswordSchema = {
    userId: {type: String},
    password: {type: String, minlength: 5},
    repeatPassword: {type: String, minlength: 5}
}

module.exports = resetPasswordSchema;