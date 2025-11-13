import mongoose from 'mongoose';

const eventSchema= new mongoose.Schema({
     title: 
     {
         type: String,
          required: true
         },
     description:{
        type:String
     } ,
     date:{ 
    type: Date,
     required: true
     },
     location:{
        type:String,
        required:true
    }, 
    availableSeats:{
      type:Number,
      required:true
    },
      image:{
        type:String,
        required:false
      } ,// URL or placeholder
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true 
    },
}, {
     timestamps: true 
    });

    export const Event = mongoose.model("Event",eventSchema);
