// src/pages/OrganizerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Ticket, Settings, LogOut, Home, Plus, Edit, Trash2, Eye, Users, DollarSign, TrendingUp,Sparkles,  Lightbulb, X } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRevenue: 0,
    totalAttendees: 0,
    activeEvents: 0
  });
  const [aiInsights, setAiInsights] = useState(null);
const [aiLoading, setAiLoading] = useState(false);
const [showAiInsights, setShowAiInsights] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);

      // Check if user is organizer
      if (userData.userType !== 'organizer') {
        alert('Access denied! Only organizers can access this page.');
        navigate('/');
        return;
      }
    } else {
      navigate('/login');
      return;
    }

    loadMyEvents();
  }, [navigate]);

  // ✅ Helper function for auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // ✅ Fetch my events from API
  const loadMyEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      console.log('Fetching my events...');

      const response = await fetch(`${API_ENDPOINTS.GET_ALL_EVENTS}/my-events`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('My Events Response:', data);

      if (data.success && data.data) {
        const events = data.data.events || [];
        setMyEvents(events);
        calculateStats(events);
      } else {
        setMyEvents([]);
        calculateStats([]);
      }
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Failed to load events');
      setMyEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Calculate stats from events
  const calculateStats = (events) => {
    const totalEvents = events.length;
    const activeEvents = events.filter(e => new Date(e.date) >= new Date()).length;
    const totalAttendees = events.reduce((sum, e) => sum + (e.attendees || 0), 0);
    const totalRevenue = events.reduce((sum, e) => sum + ((e.attendees || 0) * (e.price || 0)), 0);

    setStats({
      totalEvents,
      activeEvents,
      totalAttendees,
      totalRevenue
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  // ✅ Delete event via API
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_ENDPOINTS.GET_ALL_EVENTS}/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success || response.ok) {
        alert('Event deleted successfully!');
        loadMyEvents(); // Reload events
      } else {
        alert(data.message || 'Failed to delete event');
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Failed to delete event. Please try again.');
    }
  };

  const handleEditEvent = (event) => {
    // TODO: Navigate to edit page with event data
    alert('Edit functionality coming soon!');
    // navigate(`/edit-event/${event._id}`, { state: event });
  };

  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleViewRegistrations = (eventId) => {
    navigate(`/view-registrations/${eventId}`);
  };
  // fetch Ai insights
  const fetchAIRecommendations = async () => {
  try {
    setAiLoading(true);
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:8000/api/analytics/event-recommendations', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    console.log('AI Response:', result);

    if (result.success && result.data) {
      setAiInsights(result.data);
      setShowAiInsights(true);
    } else {
      alert(result.message || 'No insights available');
    }
  } catch (err) {
    console.error('Error fetching AI insights:', err);
    alert('Failed to load AI insights');
  } finally {
    setAiLoading(false);
  }
};

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

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

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-purple-100 text-lg mb-4">
            {user?.organizationName || 'Event Organizer Dashboard'}
          </p>
          <Link to="/create-event">
            <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Create New Event
            </button>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-gray-800">{stats.totalEvents}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Total Events</h3>
            <p className="text-sm text-green-600 mt-1">
              {stats.activeEvents} active
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-gray-800">{stats.totalAttendees}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Total Attendees</h3>
            <p className="text-sm text-gray-500 mt-1">
              Across all events
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="text-3xl font-bold text-gray-800">₹{stats.totalRevenue}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Total Revenue</h3>
            <p className="text-sm text-gray-500 mt-1">
              From all bookings
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-3xl font-bold text-gray-800">
                {stats.totalEvents > 0 ? Math.round(stats.totalAttendees / stats.totalEvents) : 0}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">Avg Attendees</h3>
            <p className="text-sm text-gray-500 mt-1">
              Per event
            </p>
          </div>
        </div>
        {/* AI Insights Section - Add AFTER stats cards */}
<div className="mb-8">
  {!showAiInsights ? (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-white/20 rounded-lg">
            <Sparkles className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">🤖 AI Event Advisor</h2>
            <p className="text-purple-100">
              Get personalized event recommendations based on your booking data
            </p>
          </div>
        </div>
        <button
          onClick={fetchAIRecommendations}
          disabled={aiLoading || myEvents.length === 0}
          className={`px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition flex items-center ${
            aiLoading || myEvents.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {aiLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-600 border-t-transparent mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Lightbulb className="h-5 w-5 mr-2" />
              Get AI Insights
            </>
          )}
        </button>
      </div>
      {myEvents.length === 0 && (
        <p className="mt-4 text-sm text-purple-200">
          💡 Create some events first to unlock AI recommendations
        </p>
      )}
    </div>
  ) : (
    <div className="bg-white rounded-xl shadow-lg p-8 relative">
      <button
        onClick={() => setShowAiInsights(false)}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">AI-Powered Insights</h2>
          <p className="text-gray-600 text-sm">
            Generated on {new Date(aiInsights?.generatedAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Analytics Summary */}
      {aiInsights?.analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-purple-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Total Events</p>
            <p className="text-2xl font-bold text-purple-600">{aiInsights.analytics.totalEvents}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Bookings</p>
            <p className="text-2xl font-bold text-blue-600">{aiInsights.analytics.totalBookings}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Avg Attendance</p>
            <p className="text-2xl font-bold text-green-600">{aiInsights.analytics.avgAttendance}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-indigo-600">₹{aiInsights.analytics.totalRevenue}</p>
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      <div className="prose max-w-none">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-800 m-0">AI Recommendations</h3>
          </div>
          <div className="text-gray-700 whitespace-pre-line">
            {aiInsights?.aiInsights}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={fetchAIRecommendations}
          disabled={aiLoading}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition flex items-center"
        >
          {aiLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Refreshing...
            </>
          ) : (
            <>
              <TrendingUp className="h-5 w-5 mr-2" />
              Refresh Insights
            </>
          )}
        </button>
      </div>
    </div>
  )}
</div>

        {/* My Events Section */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Events</h2>
            <Link to="/create-event">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                New Event
              </button>
            </Link>
          </div>

          {myEvents.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No events created yet</h3>
              <p className="text-gray-500 mb-6">Start by creating your first event!</p>
              <Link to="/create-event">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition">
                  Create Your First Event
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myEvents.map((event) => (
                <div 
                  key={event._id} 
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Event Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Event Image */}
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          {event.imageUrl ? (
                            <img 
                              src={event.imageUrl} 
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                              <Calendar className="h-10 w-10 text-purple-600" />
                            </div>
                          )}
                        </div>
                        
                        {/* Event Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                                  {new Date(event.date).toLocaleDateString()} • {event.time || 'TBA'}
                                </p>
                                <p className="flex items-center">
                                  <Users className="h-4 w-4 mr-2 text-purple-600" />
                                  {event.attendees || 0} / {event.totalSeats} attendees
                                </p>
                                <p className="flex items-center">
                                  <DollarSign className="h-4 w-4 mr-2 text-purple-600" />
                                  {event.price === 0 ? 'Free' : `₹${event.price}`}
                                </p>
                              </div>
                            </div>
                            
                            {/* Status Badge */}
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              new Date(event.date) >= new Date()
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {new Date(event.date) >= new Date() ? 'Active' : 'Completed'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex md:flex-col gap-2">
                      <button
                        onClick={() => handleViewRegistrations(event._id)}
                        className="flex-1 md:flex-none px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition flex items-center justify-center"
                        title="View Registrations"
                      >
                        <Users className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">Registrations</span>
                      </button>
                      <button
                        onClick={() => handleViewEvent(event._id)}
                        className="flex-1 md:flex-none px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition flex items-center justify-center"
                        title="View Event"
                      >
                        <Eye className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">View</span>
                      </button>
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="flex-1 md:flex-none px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition flex items-center justify-center"
                        title="Edit Event"
                      >
                        <Edit className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="flex-1 md:flex-none px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition flex items-center justify-center"
                        title="Delete Event"
                      >
                        <Trash2 className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1 text-sm text-gray-600">
                      <span>Booking Progress</span>
                      <span>{Math.round(((event.attendees || 0) / event.totalSeats) * 100)}% Full</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(((event.attendees || 0) / event.totalSeats) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;