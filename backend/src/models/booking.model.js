import mongoose from "mongoose";

const bookingSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
         ref: "User",
        required: true,

    },
     event:{
        type:mongoose.Schema.Types.ObjectId,
         ref: "Event",
        required: true,
        
    },
    status:{
        type:String,
        enum:["confirmed","cancelled","pending"],
        default:"pending"
    },
    bookingDate:{
        type:Date,
        default:Date.now
    }
},{timestamps:true})

export const Booking= mongoose.model("Booking",bookingSchema);