// src/config/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Auth
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  CURRENT_USER: `${API_BASE_URL}/auth/me`,
  
  // Events
  GET_ALL_EVENTS: `${API_BASE_URL}/events`, 
  EVENTS: `${API_BASE_URL}/events`,
  CREATE_EVENT: `${API_BASE_URL}/events`,
  EVENT_BY_ID: (id) => `${API_BASE_URL}/events/${id}`,
  GET_MY_EVENTS: `${API_BASE_URL}/events/my-events`,
  
  // Bookings
  BOOKINGS: `${API_BASE_URL}/bookings`,
  MY_BOOKINGS: `${API_BASE_URL}/bookings/my-bookings`,
  EVENT_REGISTRATIONS: (eventId) => `${API_BASE_URL}/bookings/event/${eventId}`,
  CANCEL_BOOKING: (id) => `${API_BASE_URL}/bookings/${id}`,
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export default API_BASE_URL;