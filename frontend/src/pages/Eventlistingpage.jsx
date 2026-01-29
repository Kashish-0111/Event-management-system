



import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, MapPin, Clock, Search, Filter, X, ChevronDown, ArrowUpDown, User,Home } from 'lucide-react';
// import{ User} from 'lucide-react'

const EventsListing = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [user,setUser]=useState(null)
  const eventsPerPage = 9;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Sample events data - Replace with API call
  const allEvents = [
    {
      id: 1,
      title: "Tech Conference 2026",
      category: "Technology",
      date: "Feb 15, 2026",
      time: "10:00 AM",
      location: "Mumbai",
      price: 2999,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
      attendees: 250,
      organizer: "Tech Hub India"
    },
    {
      id: 2,
      title: "Summer Music Festival",
      category: "Music",
      date: "Mar 20, 2026",
      time: "6:00 PM",
      location: "Goa",
      price: 1499,
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=250&fit=crop",
      attendees: 500,
      organizer: "Music Fest Org"
    },
    {
      id: 3,
      title: "Startup Pitch Day",
      category: "Business",
      date: "Feb 28, 2026",
      time: "9:00 AM",
      location: "Bangalore",
      price: 0,
      image: "https://images.unsplash.com/photo-1560439514-4e9645039924?w=400&h=250&fit=crop",
      attendees: 180,
      organizer: "Startup India"
    },
    {
      id: 4,
      title: "Marathon 2026",
      category: "Sports",
      date: "Mar 10, 2026",
      time: "5:00 AM",
      location: "Delhi",
      price: 599,
      image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400&h=250&fit=crop",
      attendees: 1000,
      organizer: "Delhi Sports Club"
    },
    {
      id: 5,
      title: "Art & Culture Expo",
      category: "Arts",
      date: "Apr 5, 2026",
      time: "11:00 AM",
      location: "Jaipur",
      price: 799,
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=250&fit=crop",
      attendees: 320,
      organizer: "Art Council"
    },
    {
      id: 6,
      title: "Food Festival",
      category: "Food",
      date: "Mar 25, 2026",
      time: "12:00 PM",
      location: "Pune",
      price: 399,
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=250&fit=crop",
      attendees: 450,
      organizer: "Food Lovers Association"
    },
    {
      id: 7,
      title: "AI & ML Workshop",
      category: "Technology",
      date: "Feb 22, 2026",
      time: "2:00 PM",
      location: "Hyderabad",
      price: 1999,
      image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=400&h=250&fit=crop",
      attendees: 150,
      organizer: "AI Academy"
    },
    {
      id: 8,
      title: "Rock Concert Live",
      category: "Music",
      date: "Mar 15, 2026",
      time: "7:00 PM",
      location: "Mumbai",
      price: 2499,
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=250&fit=crop",
      attendees: 800,
      organizer: "Rock Nation"
    },
    {
      id: 9,
      title: "Business Summit 2026",
      category: "Business",
      date: "Apr 10, 2026",
      time: "9:00 AM",
      location: "Delhi",
      price: 3999,
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=250&fit=crop",
      attendees: 400,
      organizer: "Business Leaders Forum"
    },
    {
      id: 10,
      title: "Cricket Tournament",
      category: "Sports",
      date: "Mar 5, 2026",
      time: "8:00 AM",
      location: "Chennai",
      price: 299,
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=250&fit=crop",
      attendees: 600,
      organizer: "Chennai Cricket Club"
    },
    {
      id: 11,
      title: "Photography Exhibition",
      category: "Arts",
      date: "Apr 15, 2026",
      time: "10:00 AM",
      location: "Kolkata",
      price: 499,
      image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=250&fit=crop",
      attendees: 200,
      organizer: "Photo Society"
    },
    {
      id: 12,
      title: "Street Food Carnival",
      category: "Food",
      date: "Mar 30, 2026",
      time: "5:00 PM",
      location: "Bangalore",
      price: 199,
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=250&fit=crop",
      attendees: 550,
      organizer: "Street Food Alliance"
    }
  ];

  // Filter events based on search and filters
  const getFilteredEvents = () => {
    let filtered = [...allEvents];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Price range filter
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      filtered = filtered.filter(event => {
        if (max) {
          return event.price >= min && event.price <= max;
        }
        return event.price >= min;
      });
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter(event => event.location === selectedLocation);
    }

    // Sort
    if (sortBy === 'latest') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => b.attendees - a.attendees);
    }

    return filtered;
  };

  const filteredEvents = getFilteredEvents();

  // Pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const categories = ['Technology', 'Music', 'Sports', 'Business', 'Arts', 'Food'];
  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Goa', 'Pune', 'Hyderabad', 'Chennai', 'Jaipur', 'Kolkata'];
  const priceRanges = [
    { label: 'Free', value: '0-0' },
    { label: '₹1 - ₹500', value: '1-500' },
    { label: '₹501 - ₹1000', value: '501-1000' },
    { label: '₹1001 - ₹2000', value: '1001-2000' },
    { label: '₹2001+', value: '2001-999999' }
  ];

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedPriceRange('');
    setSelectedLocation('');
    setSelectedDate('');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
     <nav className="bg-white shadow-md sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      {/* Logo */}
      <Link to="/">
        <div className="flex items-center cursor-pointer">
          <Calendar className="h-8 w-8 text-purple-600" />
          <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            EventHub
          </span>
        </div>
      </Link>

      {/* Right Side - Home + Profile */}
      <div className="flex items-center space-x-4">
        <Link to="/">
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-purple-600 transition font-medium">
            <Home className="h-5 w-5" />
            <span className="hidden sm:inline">Home</span>
          </button>
        </Link>

        <Link to={user?.userType === 'organizer' ? '/organizer-dashboard' : '/dashboard'}>
          <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition">
            <User className="h-5 w-5" />
            <span className="hidden sm:inline">Profile</span>
          </button>
        </Link>
      </div>
    </div>
  </div>
</nav>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Discover Events</h1>
          <p className="text-lg text-purple-100">Find and register for amazing events near you</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white shadow-md py-6 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events by name or location..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-12 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="latest">Latest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden px-6 py-3 bg-purple-600 text-white rounded-lg font-medium flex items-center justify-center"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Active Filters Display */}
          {(selectedCategory || selectedPriceRange || selectedLocation) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedCategory && (
                <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {selectedCategory}
                  <X className="h-4 w-4 ml-2 cursor-pointer" onClick={() => setSelectedCategory('')} />
                </span>
              )}
              {selectedPriceRange && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {priceRanges.find(p => p.value === selectedPriceRange)?.label}
                  <X className="h-4 w-4 ml-2 cursor-pointer" onClick={() => setSelectedPriceRange('')} />
                </span>
              )}
              {selectedLocation && (
                <span className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                  {selectedLocation}
                  <X className="h-4 w-4 ml-2 cursor-pointer" onClick={() => setSelectedLocation('')} />
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-purple-600 font-medium"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className={`md:w-64 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-32">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Filters</h3>
                <button onClick={clearFilters} className="text-sm text-purple-600 hover:text-purple-700">
                  Clear
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <label key={range.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        checked={selectedPriceRange === range.value}
                        onChange={() => setSelectedPriceRange(range.value)}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Location</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {locations.map(location => (
                    <label key={location} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="location"
                        checked={selectedLocation === location}
                        onChange={() => setSelectedLocation(location)}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-gray-700">{location}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="flex-1">
            <div className="mb-4 text-gray-600">
              Showing {currentEvents.length} of {filteredEvents.length} events
            </div>

            {currentEvents.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
                <p className="text-gray-500">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentEvents.map(event => (
                    <div 
                      key={event.id} 
                      onClick={() => navigate(`/event/${event.id}`, { state: event })}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                    >
                      <div className="relative">
                        <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                        <span className="absolute top-4 right-4 px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
                          {event.category}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">{event.title}</h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-600 text-sm">
                            <Clock className="h-4 w-4 mr-2 text-purple-600" />
                            <span>{event.date} • {event.time}</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-purple-600" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm">
                            <Users className="h-4 w-4 mr-2 text-purple-600" />
                            <span>{event.attendees} attending</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t">
                          <span className="text-2xl font-bold text-purple-600">
                            {event.price === 0 ? 'Free' : `₹${event.price}`}
                          </span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/event/${event.id}`, { state: event });
                            }}
                            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === index + 1
                            ? 'bg-purple-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsListing;