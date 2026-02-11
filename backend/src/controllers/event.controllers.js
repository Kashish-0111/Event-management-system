

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Event} from "../models/event.model.js";
import {Booking} from "../models/booking.model.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

// GET /api/events - Get all events with pagination and search
const getAllEvents = asyncHandler(async (req, res) => {
  const { search = "", page = 1, limit = 10, category = "", sort = "createdAt" } = req.query;

  // Build query
  const query = {};

  // Search filter
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  // Category filter
  if (category) {
    query.category = category;
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Sort options
  const sortOptions = {
    createdAt: { createdAt: -1 },
    date: { date: 1 },
    title: { title: 1 },
    price: { price: 1 },
  };

  const sortQuery = sortOptions[sort] || { createdAt: -1 };

  // Fetch events
  const events = await Event.find(query)
    .populate("createdBy", "username email")
    .sort(sortQuery)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count
  const totalEvents = await Event.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      events,
      pagination: {
        totalEvents,
        totalPages: Math.ceil(totalEvents / parseInt(limit)),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    }, "Events fetched successfully")
  );
});

// GET /api/events/:id - Get single event by ID
const getEventById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid event ID");
  }

  const event = await Event.findById(id).populate("createdBy", "username email");

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Get booking count for this event
  const bookingStats = await Booking.aggregate([
    {
      $match: {
        event: new mongoose.Types.ObjectId(id),
        status: "confirmed",
      },
    },
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        totalTickets: { $sum: "$tickets" },
      },
    },
  ]);

  const stats = bookingStats[0] || { totalBookings: 0, totalTickets: 0 };

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        event,
        bookingStats: {
          ...stats,
          availableSeats: event.totalSeats - stats.totalTickets,
        },
      },
      "Event fetched successfully"
    )
  );
});

// POST /api/events - Create new event
const createEvent = asyncHandler(async (req, res) => {
  const {  title, description, category, date, time, location, address, price, totalSeats, highlights, tags, organizer } = req.body;

  // Validate required fields
  if (!title || !description || !date || !location || !totalSeats) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Validate date is in future
  if (new Date(date) < new Date()) {
    throw new ApiError(400, "Event date must be in the future");
  }

  // Validate totalSeats
  if (totalSeats < 1) {
    throw new ApiError(400, "Total seats must be at least 1");
  }

  // Handle image upload
  let imageUrl = "";
  if (req.file?.path) {
    const cloudinaryResult = await uploadOnCloudinary(req.file.path);
    if (cloudinaryResult) {
      imageUrl = cloudinaryResult.secure_url;
    }
  }
  // Parse JSON strings back to arrays
  const highlightsArray = highlights ? JSON.parse(highlights) : [];
  const tagsArray = tags ? JSON.parse(tags) : [];

  // Create event
  
  const event = await Event.create({
    title,
    description,
    category,
    date,
    time,
    location,
    address,
    price: parseFloat(price) || 0,
    totalSeats: parseInt(totalSeats),
    highlights: highlightsArray,
    tags: tagsArray,
    organizer,
    imageUrl,
    createdBy: req.user._id,
    attendees: 0,
  });
  if (!event) {
    throw new ApiError(500, "Unable to create event. Please try again later");
  }

  // Populate creator info
  await event.populate("createdBy", "username email");

  return res.status(201).json(
    new ApiResponse(201, event, "Event created successfully")
  );
});

// PUT /api/events/:id - Update event
const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid event ID");
  }

  // Find event
  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Check authorization - only creator or admin can update
  if (
    event.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "You are not authorized to update this event");
  }

  // If date is being updated, validate it's in future
  if (req.body.date && new Date(req.body.date) < new Date()) {
    throw new ApiError(400, "Event date must be in the future");
  }

  // Handle image upload if new image provided
  if (req.file?.path) {
    const cloudinaryResult = await uploadOnCloudinary(req.file.path);
    if (cloudinaryResult) {
      req.body.imageUrl = cloudinaryResult.secure_url;
    }
  }

  // Update event
  const updatedEvent = await Event.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  ).populate("createdBy", "username email");

  return res.status(200).json(
    new ApiResponse(200, updatedEvent, "Event updated successfully")
  );
});

// DELETE /api/events/:id - Delete event
const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid event ID");
  }

  // Find event
  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Check authorization - only creator or admin can delete
  if (
    event.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "You are not authorized to delete this event");
  }

  // Check if event has bookings
  const bookingCount = await Booking.countDocuments({
    event: id,
    status: "confirmed",
  });

  if (bookingCount > 0) {
    throw new ApiError(
      400,
      "Cannot delete event with active bookings. Please cancel all bookings first."
    );
  }

  // Delete event
  await Event.findByIdAndDelete(id);

  // Also delete any cancelled bookings
  await Booking.deleteMany({ event: id });

  return res.status(200).json(
    new ApiResponse(200, null, "Event deleted successfully")
  );
});

// GET /api/events/my-events - Get events created by logged-in user
const getMyEvents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const events = await Event.find({ createdBy: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalEvents = await Event.countDocuments({ createdBy: req.user._id });

  // Get booking stats for each event
  const eventsWithStats = await Promise.all(
    events.map(async (event) => {
      const bookingStats = await Booking.aggregate([
        {
          $match: {
            event: event._id,
            status: "confirmed",
          },
        },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            totalTickets: { $sum: "$tickets" },
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ]);

      const stats = bookingStats[0] || {
        totalBookings: 0,
        totalTickets: 0,
        totalRevenue: 0,
      };

      return {
        ...event.toObject(),
        bookingStats: {
          ...stats,
          availableSeats: event.totalSeats - stats.totalTickets,
        },
      };
    })
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        events: eventsWithStats,
        pagination: {
          totalEvents,
          totalPages: Math.ceil(totalEvents / parseInt(limit)),
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      },
      "Your events fetched successfully"
    )
  );
});

// // GET /api/events/categories - Get all event categories
// const getEventCategories = asyncHandler(async (req, res) => {
//   const categories = await Event.distinct("category");

//   return res.status(200).json(
//     new ApiResponse(200, categories, "Categories fetched successfully")
//   );
// });

// // GET /api/events/featured - Get featured/upcoming events
// const getFeaturedEvents = asyncHandler(async (req, res) => {
//   const limit = parseInt(req.query.limit) || 6;

//   // Get upcoming events sorted by date
//   const events = await Event.find({
//     date: { $gte: new Date() },
//   })
//     .populate("createdBy", "username")
//     .sort({ date: 1 })
//     .limit(limit);

//   return res.status(200).json(
//     new ApiResponse(200, events, "Featured events fetched successfully")
//   );
// });








 


    

    
export {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getMyEvents
   

}
