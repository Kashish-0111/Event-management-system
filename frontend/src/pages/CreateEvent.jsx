// src/pages/CreateEvent.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, DollarSign, Users, Image as ImageIcon, Tag, FileText, ArrowLeft, Plus, X } from 'lucide-react';
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    time: '',
    location: '',
    address: '',
    price: '',
    totalSeats: '',
    description: '',
    image: null,
    highlights: [''],
    tags: ['']
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Check if user is organizer
      if (userData.userType !== 'organizer') {
        alert('Only organizers can create events!');
        navigate('/');
      }
    } else {
      alert('Please login as an organizer to create events!');
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
     setFormData(prev => ({ ...prev, image: file }));
    
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayChange = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeArrayItem = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.category || !formData.date || !formData.location || !formData.price) {
      alert('Please fill all required fields!');
      return;
    }
    // ✅ Check token FIRST
  const token = localStorage.getItem('token');
  console.log('Token before create event:', token);
   if(!token){
    alert('Please login first!');
    navigate('/login');
    return;
   }

 try {
    // Create FormData for file upload
    const formDataToSend = new FormData();
    
    // Add all fields
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('date', formData.date);
    formDataToSend.append('time', formData.time);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('price', parseFloat(formData.price));
    formDataToSend.append('totalSeats', parseInt(formData.totalSeats));
    
    // Add arrays as JSON strings
    formDataToSend.append('highlights', JSON.stringify(formData.highlights.filter(h => h.trim() !== '')));
    formDataToSend.append('tags', JSON.stringify(formData.tags.filter(t => t.trim() !== '')));
    
    formDataToSend.append('organizer', user.organizationName || user.name);
    
    // Add image file if exists
    if (formData.image) {
      formDataToSend.append('image', formData.image);  // ✅ Actual file object
    }

    const response = await fetch(API_ENDPOINTS.CREATE_EVENT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        // ⚠️ Don't add 'Content-Type' - FormData sets it automatically
      },
      body: formDataToSend  // ✅ FormData object
    });

    const data = await response.json();

    if (data.success) {
      alert('Event created successfully!');
      navigate('/organizer-dashboard');
    } else {
      alert(data.message || 'Failed to create event');
    }
  } catch (error) {
    console.error('Error creating event:', error);
    alert('Failed to create event. Please try again.');
  }

  };

  const categories = ['Technology', 'Music', 'Sports', 'Business', 'Arts', 'Food', 'Education', 'Health', 'Entertainment'];

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
              <Link to="/dashboard">
                <button className="flex items-center text-gray-700 hover:text-purple-600 transition">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Create New Event</h1>
          <p className="text-purple-100 text-lg">Fill in the details to create an amazing event</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FileText className="h-6 w-6 text-purple-600 mr-2" />
                Basic Information
              </h2>
              
              <div className="space-y-5">
                {/* Event Title */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                    placeholder="e.g., Tech Conference 2026"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Event Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Event Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Event Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition resize-none"
                    placeholder="Describe your event in detail..."
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <MapPin className="h-6 w-6 text-purple-600 mr-2" />
                Location Details
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Venue/City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                      placeholder="e.g., Mumbai, India"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Full Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                    placeholder="Complete venue address"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Capacity */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <DollarSign className="h-6 w-6 text-purple-600 mr-2" />
                Pricing & Capacity
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Ticket Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                      placeholder="0 for free events"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Total Seats <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      name="totalSeats"
                      value={formData.totalSeats}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                      placeholder="Maximum attendees"
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Event Image */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <ImageIcon className="h-6 w-6 text-purple-600 mr-2" />
                Event Image
              </h2>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Upload Event Banner
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData({ ...formData, image: null });
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-block mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition"
                      >
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Event Highlights</h2>
              
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'highlights')}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                    placeholder="e.g., Expert speakers, Networking opportunities"
                  />
                  {formData.highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'highlights')}
                      className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addArrayItem('highlights')}
                className="flex items-center text-purple-600 hover:text-purple-700 font-medium"
              >
                <Plus className="h-5 w-5 mr-1" />
                Add Highlight
              </button>
            </div>

            {/* Tags */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Tags</h2>
              
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'tags')}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                    placeholder="e.g., Technology, AI, Innovation"
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'tags')}
                      className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addArrayItem('tags')}
                className="flex items-center text-purple-600 hover:text-purple-700 font-medium"
              >
                <Plus className="h-5 w-5 mr-1" />
                Add Tag
              </button>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105 shadow-lg"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;