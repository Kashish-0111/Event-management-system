

import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Ticket, Share2, Bookmark, ArrowLeft, User, Mail, Phone, Heart, Star, DollarSign } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSaved, setIsSaved] = useState(false);
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchEventDetails();
  }, [id]);

  // ✅ Fetch event details from API
  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching event:', id);
      
      const response = await fetch(`${API_ENDPOINTS.GET_ALL_EVENTS}/${id}`);
      const data = await response.json();

      console.log('Event Detail Response:', data);

      if (data.success && data.data) {
        const eventData = data.data.event || data.data;
        
        // ✅ Set event with proper fallbacks
        setEvent({
          ...eventData,
          time: eventData.time || "10:00 AM - 6:00 PM",
          address: eventData.address || `${eventData.location}, India`,
          highlights: eventData.highlights || [
            "Expert speakers and industry leaders",
            "Hands-on workshops and sessions",
            "Networking opportunities",
            "Certificate of participation",
            "Refreshments included"
          ],
          tags: eventData.tags || [eventData.category, "Networking", "Community"],
          organizer: eventData.organizer || {
            name: eventData.createdBy?.name || "EventHub",
            email: eventData.createdBy?.email || "contact@eventhub.com",
            phone: "+91 9876543210",
            about: "We are dedicated to creating memorable experiences."
          }
        });
      } else {
        setError(data.message || 'Event not found');
      }
    } catch (err) {
      console.error('Error fetching event:', err);
      setError('Failed to load event details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle booking/registration
  const handleRegister = async () => {
    console.log('=== REGISTRATION START ===');
  console.log('User object:', user);
  console.log('Event object:', event);
  console.log('Event._id:', event?._id);
  console.log('Event.price:', event?.price);
  
    if (!user) {
      alert('Please login to register for this event');
      navigate('/login');
      return;
    }

      if (!event || !event._id) {
    console.log('❌ Event data missing!');
    alert('Event data not loaded. Please refresh the page.');
    return;
  }

    try {
      setBookingLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Please login first');
        navigate('/login');
        return;
      }
      

      console.log('Booking event:', event._id);

      const response = await fetch(`${API_ENDPOINTS.GET_ALL_EVENTS.replace('/events', '/bookings')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          event: event._id,
          tickets: 1,
          totalAmount: event.price,
          userDetails: {
            name: user.name,
            email: user.email,
            phone: user.phone || ''
          },
          paymentMethod: 'cash'
        })
      });
       console.log('Response status:', response.status);

    // ✅ Check for 401 specifically
    if (response.status === 401) {
      alert('Session expired. Please login again.');
      localStorage.clear();
      navigate('/login');
      return;
    }

      const data = await response.json();
      console.log('Booking Response:', data);

      if (data.success || response.ok) {
        alert('Event registered successfully!');
        navigate('/my-bookings');
      } else {
        alert(data.message || 'Failed to register for event');
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('Failed to register. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  // ✅ Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/events">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              Browse Events
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const availableSeats = event.totalSeats - (event.attendees || 0);
  const isEventFull = availableSeats <= 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
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
              <Link to="/events">
                <button className="flex items-center text-gray-700 hover:text-purple-600 transition">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Events
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Event Banner */}
      <div className="relative h-96 bg-gray-900">
        <img 
          src={event.imageUrl || event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop'} 
          alt={event.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block px-4 py-2 bg-purple-600 text-white rounded-full font-semibold mb-4">
              {event.category}
            </span>
            <h1 className="text-5xl font-bold text-white mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-6 text-white">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Event */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">About This Event</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6 whitespace-pre-line">
                {event.description}
              </p>
              
              {event.highlights && event.highlights.length > 0 && (
                <>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">What's Included</h3>
                  <ul className="space-y-3">
                    {event.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <Star className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Location Details */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Venue</h2>
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">{event.location}</p>
                  {event.address && (
                    <p className="text-gray-600 mt-1">{event.address}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-24">
              {/* Price */}
              <div className="text-center mb-6 pb-6 border-b">
                <p className="text-sm text-gray-600 mb-1">Ticket Price</p>
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {event.price === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    <div className="flex items-center justify-center">
                      <DollarSign className="h-8 w-8" />
                      <span>₹{event.price}</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600">per person</p>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-medium">Availability</span>
                  <span className="text-purple-600 font-bold">
                    {availableSeats} seats left
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      availableSeats > event.totalSeats * 0.5
                        ? 'bg-green-500'
                        : availableSeats > event.totalSeats * 0.2
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${((event.attendees || 0) / event.totalSeats) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {event.attendees || 0} people already registered
                </p>
              </div>

              {/* Register Button */}
              <button
                onClick={handleRegister}
                disabled={isEventFull || bookingLoading}
                className={`w-full py-4 rounded-lg font-bold text-lg transition transform hover:scale-105 shadow-lg mb-4 ${
                  isEventFull || bookingLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                }`}
              >
                {bookingLoading ? 'Registering...' : isEventFull ? 'Sold Out' : 'Register Now'}
              </button>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`py-3 rounded-lg font-medium transition flex items-center justify-center ${
                    isSaved 
                      ? 'bg-purple-100 text-purple-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Bookmark className={`h-5 w-5 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={handleShare}
                  className="py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition flex items-center justify-center"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </button>
              </div>

              {/* Event Info Summary */}
              <div className="border-t pt-6 space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Date & Time</p>
                    <p className="text-gray-600 text-sm">{formatDate(event.date)}</p>
                    <p className="text-gray-600 text-sm">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Location</p>
                    <p className="text-gray-600 text-sm">{event.location}</p>
                    <p className="text-gray-600 text-sm">{event.address}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Attendees</p>
                    <p className="text-gray-600 text-sm">{event.attendees || 0} / {event.totalSeats} registered</p>
                  </div>
                </div>
              </div>

              {/* Organizer */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-2">Organized by</p>
                <p className="font-semibold text-gray-800">
                  {typeof event.organizer === 'string' ? event.organizer : event.organizer?.name || 'EventHub'}
                </p>
              </div>

              {/* Safety Note */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Heart className="h-4 w-4 inline mr-1" />
                  Your safety is our priority. Guidelines will be followed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;