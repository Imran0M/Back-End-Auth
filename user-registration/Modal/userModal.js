const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
})

const User = mongoose.model('UserDetails',userSchema)
module.exports= User