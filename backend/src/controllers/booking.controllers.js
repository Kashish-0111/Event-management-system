// controllers/booking.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {Event} from "../models/event.model.js";
import {Booking} from "../models/booking.model.js";
import sendEmail from "../utils/sendEmail.utils.js";
import mongoose from "mongoose";

// POST /api/bookings - Create booking
export const createBooking = asyncHandler(async (req, res) => {
  const { event, tickets, totalAmount, userDetails, paymentMethod } = req.body;

  // Validate required fields
  if (!event || !tickets || !totalAmount || !userDetails) {
    throw new ApiError(400, "All fields are required");
  }

  // Validate event exists
  const eventData = await Event.findById(event);
  if (!eventData) {
    throw new ApiError(404, "Event not found");
  }

  // Check if event is in the future
  if (new Date(eventData.date) < new Date()) {
    throw new ApiError(400, "Cannot book past events");
  }

  // Check available seats using aggregation
  const bookedSeats = await Booking.aggregate([
    {
      $match: {
        event: new mongoose.Types.ObjectId(event),
        status: "confirmed",
      },
    },
    { $group: { _id: null, total: { $sum: "$tickets" } } },
  ]);

  const currentBookings = bookedSeats[0]?.total || 0;
  if (currentBookings + tickets > eventData.totalSeats) {
    throw new ApiError(400, "Not enough seats available");
  }

  // Create booking
  const booking = await Booking.create({
    user: req.user._id,
    event,
    tickets,
    totalAmount,
    userDetails,
    paymentMethod: paymentMethod || "cash",
    status: "confirmed",
  });

  // Update event attendees count
  await Event.findByIdAndUpdate(event, {
    $inc: { attendees: tickets },
  });

  // Populate booking data for response
  await booking.populate("event");

  // Send confirmation email
  const user = await User.findById(req.user._id);
  try {
    await sendEmail({
      to: user.email,
      subject: `Booking Confirmed: ${eventData.title}`,
      html: `
        <h2>Hi ${user.username},</h2>
        <p>Your booking for <strong>${eventData.title}</strong> is confirmed!</p>
        <p><strong>Event Details:</strong></p>
        <ul>
          <li>Date: ${new Date(eventData.date).toDateString()}</li>
          <li>Location: ${eventData.location}</li>
          <li>Tickets: ${tickets}</li>
          <li>Total Amount: ₹${totalAmount}</li>
        </ul>
        <p>See you there!</p>
      `,
    });
  } catch (emailError) {
    console.log("Email sending failed:", emailError);
    // Don't throw error, booking is already created
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, booking, "Booking created successfully")
    );
});

// GET /api/bookings/my-bookings - User's bookings
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("event")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, bookings, "Bookings fetched successfully")
    );
});

// GET /api/bookings/:id - Single booking details
export const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid booking ID");
  }

  const booking = await Booking.findById(id)
    .populate("event")
    .populate("user", "-password -refreshToken");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Check if booking belongs to user (or user is admin)
  if (
    booking.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Access denied");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, booking, "Booking details fetched successfully")
    );
});

// DELETE /api/bookings/:id - Cancel booking
export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid booking ID");
  }

  const booking = await Booking.findById(id);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Check if booking belongs to user
  if (booking.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Access denied");
  }

  // Check if already cancelled
  if (booking.status === "cancelled") {
    throw new ApiError(400, "Booking already cancelled");
  }

  // Check if event hasn't passed
  const event = await Event.findById(booking.event);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (new Date(event.date) < new Date()) {
    throw new ApiError(400, "Cannot cancel past event booking");
  }

  // Update booking status
  booking.status = "cancelled";
  await booking.save();

  // Decrease event attendees
  await Event.findByIdAndUpdate(booking.event, {
    $inc: { attendees: -booking.tickets },
  });

  // Send cancellation email
  const user = await User.findById(req.user._id);
  try {
    await sendEmail({
      to: user.email,
      subject: `Booking Cancelled: ${event.title}`,
      html: `
        <h2>Hi ${user.username},</h2>
        <p>Your booking for <strong>${event.title}</strong> has been cancelled.</p>
        <p>If you have any questions, please contact support.</p>
      `,
    });
  } catch (emailError) {
    console.log("Cancellation email failed:", emailError);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, booking, "Booking cancelled successfully")
    );
});

// GET /api/bookings/event/:eventId - Event registrations (organizer only)
export const getEventRegistrations = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ApiError(400, "Invalid event ID");
  }

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Check if user is event organizer or admin
  if (
    event.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Access denied");
  }

  // Get all confirmed bookings for this event
  const registrations = await Booking.find({
    event: eventId,
    status: "confirmed",
  })
    .populate("user", "username email phone")
    .sort({ createdAt: -1 });

  // Calculate stats
  const totalTickets = registrations.reduce(
    (sum, booking) => sum + booking.tickets,
    0
  );
  const totalRevenue = registrations.reduce(
    (sum, booking) => sum + booking.totalAmount,
    0
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        registrations,
        stats: {
          totalBookings: registrations.length,
          totalTickets,
          totalRevenue,
          availableSeats: event.totalSeats - totalTickets,
        },
      },
      "Event registrations fetched successfully"
    )
  );
});

// GET /api/bookings - Get all bookings (Admin only)
export const getAllBookings = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Access denied. Admin only.");
  }

  const bookings = await Booking.find()
    .populate("event")
    .populate("user", "username email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, bookings, "All bookings fetched successfully")
    );
});

// export {
//   createBooking,
//   getMyBookings,
//   getBookingById,
//   cancelBooking,
//   getEventRegistrations,
//   getAllBookings,
// };