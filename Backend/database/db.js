import mongoose from "mongoose"

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to mongodb database successfully")
    } catch (error) {
        console.log("Error while connecting to mongodb database", error)
    }
}

export default connectDB;