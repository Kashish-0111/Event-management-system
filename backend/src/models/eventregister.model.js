import mongoose from 'mongoose';

const eventRegisterSchema= new mongoose.Schema({
     user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["registered", "cancelled"],
    default: "registered",
  },
});

export const EventRegister= mongoose.model("EventRegister",eventRegisterSchema)