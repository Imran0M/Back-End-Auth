const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const cors = require('cors')
dotenv.config()
const app = express()
app.use(bodyParser.json())
const PORT = process.env.PORT
const DB_url = process.env.DB_url
const User = require('./Modal/userModal')
const jwt = require('jsonwebtoken');
app.use(cors());


//start app server
app.listen(PORT, () => {
    console.log('The App server is Running on', PORT)
})

//connect cloud DataBase
mongoose.connect(DB_url, {})
    .then(() => { console.log('Data Base connected') })
    .catch((err) => { console.log('Could not connected', err) })

//user signup API 
// POST method
app.post('/user/signup', async (req, res) => {
    const { username, password } = req.body
   
    try {
        const hasedPassword = await bcrypt.hash(password, 10)
        const user = await User({ username, password: hasedPassword })
        await user.save()
        res.json({ messaage: "Registered Successfully" })
    } catch (error) {
        console.log(error)
        res.json({ message: "An Error occured in Registration" }).status(500)
    }
})
// user Login API
// Post
app.post('/user/login', async (req, res) => {
    const { username, password } = req.body
    const usernameCheck = await User.findOne({ username })
    if (!usernameCheck) {
        res.json({ message: "User not found" }).status(400)
    }
    const passwordmatch = await bcrypt.compare(password, usernameCheck.password)
    if (!passwordmatch) {
        res.json({ message: "Password Does not match" })
    }

    const token = jwt.sign({ username, role: "Students" }, process.env.private_key, { expiresIn: '1h' })
    try {
        res.json(token)
    } catch (error) {
        res.json({ message: "An error occured in Login" })
    }
})
//get method

app.get('/', (req, res) => {
    res.send('Hello World!');
});
