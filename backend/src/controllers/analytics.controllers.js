// backend/src/controllers/analytics.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {Event} from "../models/event.model.js";
import {Booking} from "../models/booking.model.js";
import { getAIRecommendations, validateGeminiConfig } from "../utils/gemini.js";
import mongoose from "mongoose";


export const getEventRecommendations = asyncHandler(async (req, res) => {
  console.log('=== GET AI RECOMMENDATIONS ===');
  console.log('Organizer:', req.user.email);

  // Validate Gemini API is configured
  if (!validateGeminiConfig()) {
    throw new ApiError(500, "AI service not configured. Please contact administrator.");
  }

  // Get organizer's events
  const organizerEvents = await Event.find({ createdBy: req.user._id });
  
  if (organizerEvents.length === 0) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          hasData: false,
          message: "Create some events first to get AI recommendations!"
        },
        "No events found"
      )
    );
  }

  const eventIds = organizerEvents.map(e => e._id);

  // Get all bookings for organizer's events
  const bookings = await Booking.find({
    event: { $in: eventIds },
    status: "confirmed"
  }).populate('event');

  console.log(`Found ${bookings.length} bookings across ${organizerEvents.length} events`);

  // Analyze booking data by category
  const categoryStats = {};
  organizerEvents.forEach(event => {
    const eventBookings = bookings.filter(b => b.event._id.toString() === event._id.toString());
    const category = event.category || 'Other';
    
    if (!categoryStats[category]) {
      categoryStats[category] = {
        totalEvents: 0,
        totalBookings: 0,
        totalRevenue: 0,
        avgPrice: 0,
        avgAttendance: 0
      };
    }
    
    categoryStats[category].totalEvents += 1;
    categoryStats[category].totalBookings += eventBookings.length;
    categoryStats[category].totalRevenue += eventBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    categoryStats[category].avgPrice = event.price;
    categoryStats[category].avgAttendance = eventBookings.reduce((sum, b) => sum + b.tickets, 0);
  });

  // Calculate average attendance per event
  Object.keys(categoryStats).forEach(category => {
    if (categoryStats[category].totalEvents > 0) {
      categoryStats[category].avgAttendance = Math.round(
        categoryStats[category].avgAttendance / categoryStats[category].totalEvents
      );
    }
  });

  // Analyze price ranges
  const priceRanges = {
    'Free (₹0)': 0,
    'Budget (₹1-₹200)': 0,
    'Mid-range (₹201-₹500)': 0,
    'Premium (₹501+)': 0
  };

  bookings.forEach(booking => {
    const price = booking.event.price;
    if (price === 0) priceRanges['Free (₹0)']++;
    else if (price <= 200) priceRanges['Budget (₹1-₹200)']++;
    else if (price <= 500) priceRanges['Mid-range (₹201-₹500)']++;
    else priceRanges['Premium (₹501+)']++;
  });

  // Day-wise analysis
  const dayStats = {};
  bookings.forEach(booking => {
    const day = new Date(booking.event.date).toLocaleDateString('en-US', { weekday: 'long' });
    dayStats[day] = (dayStats[day] || 0) + 1;
  });

  // Prepare analytics data for AI
  const analyticsData = {
    totalEvents: organizerEvents.length,
    totalBookings: bookings.length,
    avgAttendance: bookings.length > 0 ? Math.round(bookings.reduce((sum, b) => sum + b.tickets, 0) / bookings.length) : 0,
    totalRevenue: bookings.reduce((sum, b) => sum + b.totalAmount, 0),
    categoryBreakdown: categoryStats,
    priceRangePerformance: priceRanges,
    popularDays: dayStats,
    organizerName: req.user.name,
    organizationName: req.user.organizationName || 'Your College'
  };

  console.log('Analytics Summary:', {
    events: analyticsData.totalEvents,
    bookings: analyticsData.totalBookings,
    categories: Object.keys(categoryStats).length
  });

  // Get AI recommendations
  const aiRecommendations = await getAIRecommendations(analyticsData);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        hasData: true,
        analytics: analyticsData,
        aiInsights: aiRecommendations,
        generatedAt: new Date()
      },
      "AI recommendations generated successfully"
    )
  );
});