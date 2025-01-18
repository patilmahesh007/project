import User from "../model/user.model.js"
import bcrypt from "bcrypt"


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
        const newUser = new User({ user, password: hashedPassword, email })
        await newUser.save()
        res.json({ success: true, message: "User registered successfully" })


    }
    catch (err) {
        res.json({ message: err.message })
    }
}
export { postSignup }