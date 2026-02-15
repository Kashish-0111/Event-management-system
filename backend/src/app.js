import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// ✅ CORS Configuration - Allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://event-management-system-one-tau.vercel.app',
  /^https:\/\/event-management-system-.*\.vercel\.app$/  // Regex for all Vercel previews
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// ============= ROUTES IMPORT =============
import userRouter from "./routes/user.routes.js";
import eventRoutes from './routes/event.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

// ============= ROUTES DECLARATION =============
app.use("/api/users", userRouter);
app.use("/api/auth", userRouter); 
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/analytics', analyticsRoutes);

// ============= HEALTH CHECK ROUTE =============
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'EventHub Backend API is running! 🚀',
    endpoints: {
      events: '/api/events',
      auth: '/api/auth',
      bookings: '/api/bookings',
      analytics: '/api/analytics'
    }
  });
});

export {app};
