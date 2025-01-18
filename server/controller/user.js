import User from "../model/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const postSignup = async (req, res) => {
    const { user, password, email } = req.body
    if (!user || !password || !email) {
        return res.json({ message: "all fields are required" })
    }
    const userExists = await User.findOne({ email })

    try {
        if (userExists) {
            return res.json({ message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ user, password: hashedPassword, email,role:"user" })
        await newUser.save()
        res.json({ success: true, message: "User registered successfully" })
    }
    catch (err) {
        res.json({ message: err.message })
    }
}

const postLogin = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.json({ message: "all fields are required" })
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ message: "User not found" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.json({ message: "Invalid credentials" })
        }
const jwtToken=jwt.sign({id:user._id,role:user.role,email:user.email},process.env.JWT_SECRET)

res.setHeader("Authorization",`Bearer ${jwtToken}`)

        res.json({ success: true, message: "Login successful",token:jwtToken })
    }
    catch (err) {
        res.json({ message: err.message })
    }
}

export { postSignup ,postLogin}