import express from "express"
import cors from "cors"
import mongoose from 'mongoose'
import dotenv from "dotenv"


const app=express()
dotenv.config()
app.use(cors())
app.use(express.json())


app.get("/health",(req,res)=>{
    res.json({message:"server is health"})
})


const port=process.env.PORT || 5000

const uri=process.env.ATLAS_URI

const connetDB=async()=>{
   try{
    await mongoose.connect(uri)
    console.log("Database Connected")
   }
   catch(err){
      console.log(err)
   }
}
app.listen(port,()=>{
    connetDB()
    console.log(`Server is running on port ${port}`)
})