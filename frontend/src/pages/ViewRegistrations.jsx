// src/pages/ViewRegistrations.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, Mail, Phone, Download, ArrowLeft, LogOut, Home, Search, Filter, User } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const ViewRegistrations = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);

      // Check if user is organizer
      if (userData.userType !== 'organizer') {
        alert('Access denied! Only organizers can view registrations.');
        navigate('/');
        return;
      }
    } else {
      navigate('/login');
      return;
    }

    loadEventAndRegistrations();
  }, [eventId, navigate]);

  // ✅ API Integration - Fetch from backend
  const loadEventAndRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch event details
      const eventResponse = await fetch(`${API_ENDPOINTS.GET_ALL_EVENTS}/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const eventData = await eventResponse.json();

      console.log('Event Data:', eventData);

      if (eventData.success && eventData.data) {
        setEvent(eventData.data.event || eventData.data);
      } else {
        setError('Event not found');
        return;
      }

      // Fetch registrations for this event
      const registrationsResponse = await fetch(
        `${API_ENDPOINTS.GET_ALL_EVENTS.replace('/events', '/bookings')}/event/${eventId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const registrationsData = await registrationsResponse.json();

      console.log('Registrations Data:', registrationsData);

      if (registrationsData.success && registrationsData.data) {
        setRegistrations(registrationsData.data.registrations || []);
      } else {
        setRegistrations([]);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const getFilteredRegistrations = () => {
    if (!searchTerm) return registrations;

    return registrations.filter(reg => 
      reg.userDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.userDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.userDetails?.phone?.includes(searchTerm)
    );
  };

  const handleExportCSV = () => {
    // Create CSV content
    let csvContent = "Booking ID,Name,Email,Phone,Tickets,Amount,Booking Date\n";
    
    registrations.forEach(reg => {
      csvContent += `${reg._id},${reg.userDetails?.name},${reg.userDetails?.email},${reg.userDetails?.phone},${reg.tickets},${reg.totalAmount},${new Date(reg.createdAt).toLocaleDateString()}\n`;
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event?.title}_Registrations.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredRegistrations = getFilteredRegistrations();

  const totalTickets = registrations.reduce((sum, reg) => sum + (reg.tickets || 0), 0);
  const totalRevenue = registrations.reduce((sum, reg) => sum + (reg.totalAmount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading registrations...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/organizer-dashboard">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              Back to Dashboard
            </button>
          </Link>
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
              <Link to="/organizer-dashboard">
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
          <h1 className="text-4xl font-bold mb-2">Event Registrations</h1>
          <p className="text-purple-100 text-lg">{event.title}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Event Summary */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Event Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-600 mb-1">Event Date</p>
              <p className="text-lg font-bold text-gray-800">
                {new Date(event.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Location</p>
              <p className="text-lg font-bold text-gray-800">{event.location}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Ticket Price</p>
              <p className="text-lg font-bold text-purple-600">
                {event.price === 0 ? 'Free' : `₹${event.price}`}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Total Capacity</p>
              <p className="text-lg font-bold text-gray-800">{event.totalSeats} seats</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-gray-800">{registrations.length}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Total Registrations</h3>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-gray-800">{totalTickets}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Total Tickets</h3>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <span className="text-3xl font-bold text-gray-800">₹{totalRevenue}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Total Revenue</h3>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <span className="text-3xl font-bold text-gray-800">
                {event.totalSeats > 0 ? Math.round((totalTickets / event.totalSeats) * 100) : 0}%
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">Capacity Filled</h3>
          </div>
        </div>

        {/* Registrations List */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              All Registrations ({filteredRegistrations.length})
            </h2>
            
            <div className="flex gap-3">
              {/* Search */}
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, phone..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none w-full md:w-64"
                />
              </div>

              {/* Export Button */}
              {registrations.length > 0 && (
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Export CSV
                </button>
              )}
            </div>
          </div>

          {/* Registrations Table/Cards */}
          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-16">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {registrations.length === 0 ? 'No registrations yet' : 'No results found'}
              </h3>
              <p className="text-gray-500">
                {registrations.length === 0 
                  ? 'Registrations will appear here once people book tickets'
                  : 'Try a different search term'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendee Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tickets
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-purple-600">
                          #{reg._id.slice(-8)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                            {reg.userDetails?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {reg.userDetails?.name || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-center mb-1">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {reg.userDetails?.email || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-900 flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {reg.userDetails?.phone || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">
                          {reg.tickets}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-green-600">
                          ₹{reg.totalAmount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(reg.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link to="/organizer-dashboard">
            <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition">
              ← Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewRegistrations;