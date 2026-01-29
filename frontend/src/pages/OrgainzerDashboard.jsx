// src/pages/OrganizerDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Ticket, Settings, LogOut, Home, Plus, Edit, Trash2, Eye, Users, DollarSign, TrendingUp } from 'lucide-react';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRevenue: 0,
    totalAttendees: 0,
    activeEvents: 0
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);

      // Check if user is organizer
      if (userData.userType !== 'organizer') {
        alert('Access denied! This page is for organizers only.');
        navigate('/dashboard');
        return;
      }

      // Load created events from localStorage
      loadMyEvents();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const loadMyEvents = () => {
    const createdEvents = JSON.parse(localStorage.getItem('createdEvents') || '[]');
    setMyEvents(createdEvents);

    // Calculate stats
    const totalEvents = createdEvents.length;
    const totalRevenue = createdEvents.reduce((sum, event) => sum + (event.price * event.attendees || 0), 0);
    const totalAttendees = createdEvents.reduce((sum, event) => sum + (event.attendees || 0), 0);
    const activeEvents = createdEvents.filter(event => new Date(event.date) >= new Date()).length;

    setStats({
      totalEvents,
      totalRevenue,
      totalAttendees,
      activeEvents
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleDeleteEvent = (index) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = myEvents.filter((_, i) => i !== index);
      localStorage.setItem('createdEvents', JSON.stringify(updatedEvents));
      setMyEvents(updatedEvents);
      alert('Event deleted successfully!');
      loadMyEvents();
    }
  };

  const handleEditEvent = (event, index) => {
    // TODO: Navigate to edit page with event data
    alert('Edit functionality coming soon!');
  };

  const handleViewEvent = (event, index) => {
    // Navigate to event details (use state to pass data)
    navigate(`/event/${index}`, { state: event });
  };

  const handleViewRegistrations = (index) => {
    // Navigate to view registrations page
    navigate(`/view-registrations/${index}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                EventHub
              </span>
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
                {myEvents.length > 0 ? Math.round(stats.totalAttendees / stats.totalEvents) : 0}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">Avg Attendees</h3>
            <p className="text-sm text-gray-500 mt-1">
              Per event
            </p>
          </div>
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
              {myEvents.map((event, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Event Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Event Image Placeholder */}
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-10 w-10 text-purple-600" />
                        </div>
                        
                        {/* Event Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                                  {event.date} • {event.time}
                                </p>
                                <p className="flex items-center">
                                  <Users className="h-4 w-4 mr-2 text-purple-600" />
                                  {event.attendees || 0} / {event.totalSeats} attendees
                                </p>
                                <p className="flex items-center">
                                  <DollarSign className="h-4 w-4 mr-2 text-purple-600" />
                                  {event.price === 0 || event.price === '0' ? 'Free' : `₹${event.price}`}
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
                        onClick={() => handleViewRegistrations(index)}
                        className="flex-1 md:flex-none px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition flex items-center justify-center"
                        title="View Registrations"
                      >
                        <Users className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">Registrations</span>
                      </button>
                      <button
                        onClick={() => handleViewEvent(event, index)}
                        className="flex-1 md:flex-none px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition flex items-center justify-center"
                        title="View Event"
                      >
                        <Eye className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">View</span>
                      </button>
                      <button
                        onClick={() => handleEditEvent(event, index)}
                        className="flex-1 md:flex-none px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition flex items-center justify-center"
                        title="Edit Event"
                      >
                        <Edit className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(index)}
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
                        style={{ width: `${((event.attendees || 0) / event.totalSeats) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Profile Settings</h3>
                <p className="text-sm text-gray-600">Manage your account</p>
              </div>
            </div>
          </div> */}

          {/* <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Ticket className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">View Bookings</h3>
                <p className="text-sm text-gray-600">See all registrations</p>
              </div>
            </div>
          </div> */}

          {/* <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Settings className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Settings</h3>
                <p className="text-sm text-gray-600">Configure preferences</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;