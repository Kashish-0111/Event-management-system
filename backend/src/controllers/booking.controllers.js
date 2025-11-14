import { asyncHandler } from "../utils/asyncHandler";

import { ApiResponse } from "../utils/ApiResponse";
import {User} from "../models/user.model.js"
import { ApiError } from "../utils/ApiError";
import Event from "../models/event.model.js";
import sendEmail from "../utils/sendEmail.utils.js";
import { EventRegister } from "../models/eventregister.model";


const bookEvent = asyncHandler(async (req,res) => {
    const {eventId}= req.body;
    const userId = req.user._id;

    // check if event exists

    const event = await Event.findCById(eventId);
     if (!event) throw new ApiError(404, "Event not found");
 
     
  //  Check if already booked
    const existingBooking = await EventRegister.findOne({
    user: userId,
    event: eventId,
    status: "registered",
  });
   if (existingBooking) {
    throw new ApiError(400, "You have already booked this event");
  }
   // check for available seats
   if (event.availableSeats <= 0) {
    throw new ApiError(400, "No seats available for this event");
  }
    //  Create booking
  const booking = await EventRegister.create({
    user: userId,
    event: eventId,
    status: "registered",
  });
  //  Reduce availableSeats
  event.availableSeats -= 1;
  await event.save();

   // Send confirmation email
  const user = await User.findById(userId);
  sendEmail({
    to: user.email,
    subject: `Booking Confirmed: ${event.title}`,
    html: `<h2>Hi ${user.username},</h2><p>Your booking for <strong>${event.title}</strong> on ${event.date.toDateString()} is confirmed. See you there!</p>`,
  });

   //  Return success response
  return res.status(201).json(
    new ApiResponse(201, "Event booked successfully", { booking })
  );
})


 const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("event");
  return res.json(new ApiResponse(200, bookings, "My bookings fetched"));
});

 const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("event user");
  if (!booking) throw new ApiError(404, "Booking not found");
  return res.json(new ApiResponse(200, booking, "Booking details fetched"));
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, "Booking not found");

  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "Not authorized to cancel this booking");
  }

   booking.status = "cancelled";
  await booking.save();

  // Optional: seat increment
  const event = await Event.findById(booking.event);
  event.availableSeats += 1;
  await event.save();

  return res.json(new ApiResponse(200, booking, "Booking cancelled successfully"));
});

const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().populate("event user");
  return res.json(new ApiResponse(200, bookings, "All bookings fetched"));
});


export {
  bookEvent,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings


};