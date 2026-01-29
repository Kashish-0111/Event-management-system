// src/pages/MyBookings.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Ticket, Download, X, Eye, ArrowLeft, LogOut, Home, Filter } from 'lucide-react';

const MyBookings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      alert('Please login to view your bookings');
      navigate('/login');
    }

    // Load bookings
    loadBookings();
  }, [navigate]);

  const loadBookings = () => {
    const myBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
    setBookings(myBookings);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleCancelBooking = (index) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const updatedBookings = bookings.filter((_, i) => i !== index);
      localStorage.setItem('myBookings', JSON.stringify(updatedBookings));
      setBookings(updatedBookings);
      alert('Booking cancelled successfully!');
    }
  };

  const handleViewEvent = (booking) => {
    navigate(`/event/${booking.event.id}`, { state: booking.event });
  };

  const handleDownloadTicket = (booking) => {
    // Demo: Create a simple ticket text
    const ticketText = `
=====================================
        EVENTHUB TICKET
=====================================

Booking ID: ${booking.bookingId}
Event: ${booking.event.title}
Date: ${booking.event.date}
Time: ${booking.event.time}
Location: ${booking.event.location}

Ticket Holder: ${booking.userDetails.name}
Email: ${booking.userDetails.email}
Phone: ${booking.userDetails.phone}

Number of Tickets: ${booking.tickets}
Total Amount: ₹${booking.totalAmount}
Payment Method: ${booking.paymentMethod.toUpperCase()}

Booked on: ${new Date(booking.bookingDate).toLocaleDateString()}

=====================================
    Thank you for booking with us!
    Please show this ticket at venue
=====================================
    `;

    // Create and download file
    const blob = new Blob([ticketText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ticket_${booking.bookingId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFilteredBookings = () => {
    const now = new Date();
    
    if (filter === 'upcoming') {
      return bookings.filter(b => new Date(b.event.date) >= now);
    } else if (filter === 'past') {
      return bookings.filter(b => new Date(b.event.date) < now);
    }
    return bookings;
  };

  const filteredBookings = getFilteredBookings();

  const upcomingCount = bookings.filter(b => new Date(b.event.date) >= new Date()).length;
  const pastCount = bookings.filter(b => new Date(b.event.date) < new Date()).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/">
                <div className="flex items-center cursor-pointer">
                  <Calendar className="h-8 w-8 text-purple-600" />
                  <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    EventHub
                  </span>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <button className="px-4 py-2 text-gray-700 hover:text-purple-600 transition">
                  <Home className="h-5 w-5" />
                </button>
              </Link>
              <Link to="/dashboard">
                <button className="flex items-center text-gray-700 hover:text-purple-600 transition">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Dashboard
                </button>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-purple-100 text-lg">View and manage all your event bookings</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Ticket className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-gray-800">{bookings.length}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Total Bookings</h3>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-gray-800">{upcomingCount}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Upcoming Events</h3>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="text-3xl font-bold text-gray-800">{pastCount}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Past Events</h3>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">All Bookings</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({bookings.length})
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'upcoming'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upcoming ({upcomingCount})
              </button>
              <button
                onClick={() => setFilter('past')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'past'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Past ({pastCount})
              </button>
            </div>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16">
              <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-6">
                {filter === 'upcoming' ? "You don't have any upcoming events" : 
                 filter === 'past' ? "You haven't attended any events yet" :
                 "You haven't booked any events yet"}
              </p>
              <Link to="/events">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition">
                  Browse Events
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking, index) => (
                <div 
                  key={index}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">
                            {booking.event.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            Booking ID: {booking.bookingId}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          new Date(booking.event.date) >= new Date()
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {new Date(booking.event.date) >= new Date() ? 'Upcoming' : 'Completed'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                          {booking.event.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-purple-600" />
                          {booking.event.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-purple-600" />
                          {booking.event.location}
                        </div>
                        <div className="flex items-center">
                          <Ticket className="h-4 w-4 mr-2 text-purple-600" />
                          {booking.tickets} Ticket{booking.tickets > 1 ? 's' : ''}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Total Amount Paid:</span>
                          <span className="text-xl font-bold text-purple-600">₹{booking.totalAmount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex lg:flex-col gap-2">
                      <button
                        onClick={() => handleDownloadTicket(booking)}
                        className="flex-1 lg:flex-none px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition flex items-center justify-center"
                        title="Download Ticket"
                      >
                        <Download className="h-4 w-4 lg:mr-2" />
                        <span className="hidden lg:inline">Download</span>
                      </button>
                      {/* <button
                        onClick={() => handleViewEvent(booking)}
                        className="flex-1 lg:flex-none px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition flex items-center justify-center"
                        title="View Event"
                      >
                        <Eye className="h-4 w-4 lg:mr-2" />
                        <span className="hidden lg:inline">View</span>
                      </button> */}
                      {new Date(booking.event.date) >= new Date() && (
                        <button
                          onClick={() => handleCancelBooking(index)}
                          className="flex-1 lg:flex-none px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition flex items-center justify-center"
                          title="Cancel Booking"
                        >
                          <X className="h-4 w-4 lg:mr-2" />
                          <span className="hidden lg:inline">Cancel</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Attendee Details */}
                  <div className="mt-4 pt-4 border-t bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">
                      <strong>Attendee:</strong> {booking.userDetails.name} | {booking.userDetails.email} | {booking.userDetails.phone}
                    </p>
                    {booking.userDetails.specialRequests && (
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Special Requests:</strong> {booking.userDetails.specialRequests}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Browse More Events CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Looking for more events?</h2>
          <p className="text-purple-100 text-lg mb-6">
            Discover amazing events happening near you
          </p>
          <Link to="/events">
            <button className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition transform hover:scale-105">
              Browse All Events
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;