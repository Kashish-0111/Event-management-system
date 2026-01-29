import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {  // Added - Technology, Music, Sports, etc.
        type: String,
        required: true,
        enum: ['Technology', 'Music', 'Sports', 'Business', 'Arts', 'Food', 'Education', 'Health', 'Entertainment']
    },
    date: {
        type: Date,
        required: true
    },
    time: {  // Added - Event time (10:00 AM)
        type: String,
        required: true
    },
    location: {  // City/Venue name
        type: String,
        required: true
    },
    address: {  // Full address
        type: String
    },
    price: {  // Added - Ticket price
        type: Number,
        required: true,
        default: 0
    },
    totalSeats: {  // Changed from availableSeats
        type: Number,
        required: true
    },
    attendees: {  // Added - Current bookings count
        type: Number,
        default: 0
    },
    image: {
        type: String,  // Cloudinary URL
        default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop'
    },
    highlights: {  // Added - Array of event highlights
        type: [String],
        default: []
    },
    tags: {  // Added - Array of tags
        type: [String],
        default: []
    },
    organizer: {  // Added - Organizer name for display
        type: String,
        required: true
    },
    createdBy: {  // User ID reference
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Index for search optimization
eventSchema.index({ title: 'text', description: 'text', location: 'text' });

export const Event = mongoose.model("Event", eventSchema);