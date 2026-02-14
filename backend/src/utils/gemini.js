// backend/src/utils/gemini.utils.js

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate AI-powered event recommendations for organizers
 * @param {Object} analyticsData - Booking and event analytics data
 * @returns {String} AI-generated recommendations
 */
export const getAIRecommendations = async (analyticsData) => {
  try {
    console.log('=== GEMINI AI REQUEST ===');
    console.log('Analytics Data:', analyticsData);

    // Get Gemini Pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create detailed prompt
    const prompt = `
You are an expert AI event advisor for college event organizers. Analyze this booking data and provide actionable, data-driven insights.

BOOKING ANALYTICS DATA:
${JSON.stringify(analyticsData, null, 2)}

Based on this data, provide:

1. **Most Popular Categories**: Which event types students prefer most
2. **Optimal Pricing**: Best price range for maximum bookings
3. **Peak Times**: Best days and times for events
4. **Attendance Patterns**: Average attendance and trends
5. **Specific Recommendations**: 2-3 concrete event ideas with:
   - Event type
   - Suggested price
   - Best timing
   - Expected attendance
6. **Growth Opportunities**: Underutilized categories with potential

Format your response in clear, bullet-pointed sections. Be specific with numbers and actionable advice.
Keep the tone professional but friendly.
    `;

    console.log('Sending request to Gemini...');

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('✅ Gemini Response Received');
    console.log('Response length:', text.length);

    return text;

  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    
    // Return fallback response if AI fails
    return `
**AI Recommendations Unavailable**

Unable to generate AI insights at the moment. Here are basic analytics:

- Total Events: ${analyticsData.totalEvents || 0}
- Total Bookings: ${analyticsData.totalBookings || 0}
- Average Attendance: ${analyticsData.avgAttendance || 0}

Please try again later or contact support.
    `;
  }
};

/**
 * Validate Gemini API configuration
 * @returns {Boolean} True if API key is configured
 */
export const validateGeminiConfig = () => {
  if (!process.env.GEMINI_API_KEY) {
    console.error('⚠️ GEMINI_API_KEY not found in environment variables');
    return false;
  }
  
  if (!process.env.GEMINI_API_KEY.startsWith('AIzaSy')) {
    console.error('⚠️ Invalid GEMINI_API_KEY format');
    return false;
  }
  
  console.log('✅ Gemini API configured successfully');
  return true;
};

