import { Schema, model } from "mongoose"
const userSchema = new Schema({
user:{
    type: String,
    required: true
},
password:{
    type: String,
    required: true
},email:{
    type: String,
    required: true,
    unique: true
}
}, { timestamps: true })

export default model("user", userSchema)