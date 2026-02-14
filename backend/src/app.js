import express from "express";
import  cors from "cors";
import cookieParser from "cookie-parser";

const app =express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended:true,limit:"16kb"}))

app.use(express.static("public"))

app.use(cookieParser());

// routes import

import userRouter from "./routes/user.routes.js";
// routes declartion
app.use("/api/users",userRouter)
app.use("/api/auth", userRouter); 


import eventRoutes from './routes/event.routes.js';
import bookingRoutes from './routes/booking.routes.js';


app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

import analyticsRoutes from './routes/analytics.routes.js';
app.use('/api/analytics', analyticsRoutes);
export {app};
