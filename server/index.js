import express from "express"
import cors from "cors"
import mongoose from 'mongoose'
import dotenv from "dotenv"


const app = express()
dotenv.config()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import { postSignup,postLogin } from "./controller/user.js"
import { forgotPassword, resetPassword } from "./controller/forgot.js"

app.get("/health", (req, res) => {
    res.json({ success: true, message: "Server is healthy" })
})
app.post("/register",postSignup)
app.post("/Login",postLogin)


app.post('/forgot-password', forgotPassword);

app.post('/reset-password/:token', resetPassword);

const port = process.env.PORT || 5000
const uri = process.env.MONGO_URI

const connetDB = async () => {
    try {
        await mongoose.connect(uri)
        console.log("Database Connected")
    }
    catch (err) {
        console.log(err)
    }
}
app.listen(port, () => {
    connetDB()
    console.log(`Server is running on port ${port}`)
})