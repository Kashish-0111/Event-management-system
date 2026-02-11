import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    bookingId: {  // Added - Unique ID for display (BK1234567890)
        type: String,
         default: function() {
        return 'BKG-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      },
        unique: true,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    tickets: {  // Added - Number of tickets
        type: Number,
        required: true,
        min: 1
    },
    totalAmount: {  // Added - Total payment
        type: Number,
        required: true
    },
    userDetails: {  // Added - For ticket display
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        specialRequests: {  // Added - Optional user notes
            type: String,
            default: ''
        }
    },
    paymentMethod: {  // Added - Payment type
        type: String,
        enum: ['card', 'upi', 'netbanking',"cash"],
        required: true
    },
    status: {
        type: String,
        enum: ["confirmed", "cancelled", "pending"],
        default: "confirmed"  // Changed default to confirmed (payment done)
    },
    bookingDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Generate unique booking ID before saving
bookingSchema.pre('save', function(next) {
    if (!this.bookingId) {
        this.bookingId = 'BK' + Date.now();
    }
    next();
});

export const Booking = mongoose.model("Booking", bookingSchema);