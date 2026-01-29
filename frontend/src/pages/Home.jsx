


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, Ticket, Music, Trophy, Laptop, Briefcase, Heart, MapPin, Clock, ArrowRight, Menu, X, User, LogOut } from 'lucide-react';


const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
    navigate('/');
  };
 
  const events = [
    {
      id: 1,
      title: "Tech Conference 2026",
      category: "Technology",
      date: "Feb 15, 2026",
      location: "Mumbai, India",
      price: "₹2,999",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
      attendees: 250
    },
    {
      id: 2,
      title: "Summer Music Festival",
      category: "Music",
      date: "Mar 20, 2026",
      location: "Goa, India",
      price: "₹1,499",
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=250&fit=crop",
      attendees: 500
    },
    {
      id: 3,
      title: "Startup Pitch Day",
      category: "Business",
      date: "Feb 28, 2026",
      location: "Bangalore, India",
      price: "Free",
      image: "https://images.unsplash.com/photo-1560439514-4e9645039924?w=400&h=250&fit=crop",
      attendees: 180
    },
    {
      id: 4,
      title: "Marathon 2026",
      category: "Sports",
      date: "Mar 10, 2026",
      location: "Delhi, India",
      price: "₹599",
      image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400&h=250&fit=crop",
      attendees: 1000
    },
    {
      id: 5,
      title: "Art & Culture Expo",
      category: "Arts",
      date: "Apr 5, 2026",
      location: "Jaipur, India",
      price: "₹799",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=250&fit=crop",
      attendees: 320
    },
    {
      id: 6,
      title: "Food Festival",
      category: "Food",
      date: "Mar 25, 2026",
      location: "Pune, India",
      price: "₹399",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=250&fit=crop",
      attendees: 450
    }
  ];

  const categories = [
    { name: "Music", icon: Music, color: "bg-purple-100 text-purple-600" },
    { name: "Sports", icon: Trophy, color: "bg-blue-100 text-blue-600" },
    { name: "Technology", icon: Laptop, color: "bg-indigo-100 text-indigo-600" },
    { name: "Business", icon: Briefcase, color: "bg-violet-100 text-violet-600" },
    { name: "Arts", icon: Heart, color: "bg-fuchsia-100 text-fuchsia-600" }
  ];

  const stats = [
    { label: "Total Events", value: "5,000+", icon: Calendar },
    { label: "Active Users", value: "50,000+", icon: Users },
    { label: "Bookings", value: "100,000+", icon: Ticket }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                EventHub
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-purple-600 font-medium transition">Home</Link>
              <Link to="/events" className="text-gray-700 hover:text-purple-600 font-medium transition">Events</Link>
              <a href="#about" className="text-gray-700 hover:text-purple-600 font-medium transition">About</a>
              <a href="#contact" className="text-gray-700 hover:text-purple-600 font-medium transition">Contact</a>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                 <Link to={user?.userType === 'organizer' ? '/organizer-dashboard' : '/dashboard'}>
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition">
                      <User className="h-5 w-5" />
                      <span>{user?.name || 'Profile'}</span>
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
              ) : (
                <>
                  <Link to="/login">
                    <button className="px-4 py-2 text-purple-600 font-medium hover:text-purple-700 transition">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <Link to="/" className="block text-gray-700 hover:text-purple-600 font-medium">Home</Link>
              <Link to="/events" className="block text-gray-700 hover:text-purple-600 font-medium">Events</Link>
              <a href="#about" className="block text-gray-700 hover:text-purple-600 font-medium">About</a>
              <a href="#contact" className="block text-gray-700 hover:text-purple-600 font-medium">Contact</a>
              <div className="pt-3 border-t space-y-2">
                {isLoggedIn ? (
                  <>
                   
                   <Link to={user?.userType === 'organizer' ? '/organizer-dashboard' : '/dashboard'}> 
                      <button className="w-full px-4 py-2 bg-purple-100 text-purple-600 rounded-lg font-medium flex items-center justify-center">
                        <User className="h-5 w-5 mr-2" />
                        {user?.name || 'Profile'}
                      </button>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium flex items-center justify-center"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <button className="w-full px-4 py-2 text-purple-600 border border-purple-600 rounded-lg font-medium">
                        Login
                      </button>
                    </Link>
                    <Link to="/signup">
                      <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium">
                        Sign Up
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Discover Amazing Events
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Create, Manage, and Join Events That Matter
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events">
                <button className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition flex items-center justify-center">
                  Browse Events
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
              {/* <button className="px-8 py-4 bg-purple-700 text-white rounded-lg font-semibold text-lg hover:bg-purple-800 transition border-2 border-white">
                Create Event
              </button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section id="events" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Events</h2>
          <p className="text-gray-600 text-lg">Discover upcoming events near you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <span className="absolute top-4 right-4 px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
                  {event.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-purple-600" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-purple-600" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2 text-purple-600" />
                    <span className="text-sm">{event.attendees} attending</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-2xl font-bold text-purple-600">{event.price}</span>
                  <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition" onClick={()=>navigate(`/event/${event.id}`)}>
                   View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Event Categories</h2>
            <p className="text-gray-600 text-lg">Explore events by category</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div 
                  key={index}
                  className="flex flex-col items-center p-6 rounded-xl bg-gray-50 hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50 cursor-pointer transition-all duration-300 transform hover:scale-105"
                >
                  <div className={`p-4 rounded-full ${category.color} mb-3`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <span className="font-semibold text-gray-700">{category.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-purple-100 text-lg">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">About EventHub</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Your trusted platform for discovering, creating, and managing events that bring people together
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h3>
              <p className="text-gray-600 text-lg mb-4">
                At EventHub, we believe in the power of shared experiences. Our mission is to make event discovery and management seamless, connecting event organizers with enthusiastic attendees across India.
              </p>
              <p className="text-gray-600 text-lg mb-6">
                Whether you're planning a tech conference, music festival, or community gathering, EventHub provides the tools and platform to make your event a success.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">5000+ Events</h4>
                  <p className="text-gray-600">Successfully hosted</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8">
              <img 
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop" 
                alt="About EventHub"
                className="rounded-xl shadow-lg w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Easy to Use</h3>
              <p className="text-gray-600">
                Simple and intuitive interface for both organizers and attendees
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Secure Booking</h3>
              <p className="text-gray-600">
                Safe and secure ticket booking with multiple payment options
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Dedicated support team available round the clock
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Get In Touch</h2>
            <p className="text-gray-600 text-lg">
              Have questions? We'd love to hear from you. Send us a message!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                    placeholder="+91 1234567890"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Message</label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105 shadow-lg">
                  Send Message
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Email</h4>
                      <p className="text-gray-600">support@eventhub.com</p>
                      <p className="text-gray-600">info@eventhub.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Phone</h4>
                      <p className="text-gray-600">+91 1234567890</p>
                      <p className="text-gray-600">+91 0987654321</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Office</h4>
                      <p className="text-gray-600">
                        123 Event Street, Tech Park<br />
                        Mumbai, Maharashtra 400001<br />
                        India
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center hover:bg-purple-200 transition">
                    <span className="text-purple-600 text-xl font-bold">f</span>
                  </a>
                  <a href="#" className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition">
                    <span className="text-blue-600 text-xl font-bold">𝕏</span>
                  </a>
                  <a href="#" className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center hover:bg-indigo-200 transition">
                    <span className="text-indigo-600 text-xl font-bold">in</span>
                  </a>
                  <a href="#" className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center hover:bg-pink-200 transition">
                    <span className="text-pink-600 text-xl">📷</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Calendar className="h-8 w-8 text-purple-400" />
                <span className="ml-2 text-2xl font-bold">EventHub</span>
              </div>
              <p className="text-gray-400">Your one-stop platform for discovering and managing events.</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">Events</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">FAQs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition">
                  <span className="text-xl">f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition">
                  <span className="text-xl">𝕏</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition">
                  <span className="text-xl">in</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition">
                  <span className="text-xl">📷</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 EventHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;