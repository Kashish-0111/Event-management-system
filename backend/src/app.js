import express from "express";
import  cors from "cors";
import coikieParser from "cookie-parser";

const app =express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended:true,limit:"16kb"}))

app.use(express.static("public"))

app.use(coikieParser());

// routes import

import userRouter from "./routes/user.routes.js";
// routes declartion
app.use("/api/v1/users",userRouter)
// server.js
import authRoutes from './routes/auth.routes.js';
import eventRoutes from './routes/event.routes.js';
import bookingRoutes from './routes/booking.routes.js';

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
export {app};
