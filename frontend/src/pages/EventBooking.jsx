// src/pages/EventBooking.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, CreditCard, User, Mail, Phone, ArrowLeft, Check, X } from 'lucide-react';

const EventBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;
  
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Confirmation
  const [ticketCount, setTicketCount] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Pre-fill form with user data
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        specialRequests: ''
      });
    } else {
      alert('Please login to book this event');
      navigate('/login');
    }

    // Check if event data exists
    if (!event) {
      alert('Event not found! Please select an event first.');
      navigate('/events');
    }
  }, [navigate, event]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTicketChange = (change) => {
    const newCount = ticketCount + change;
    if (newCount >= 1 && newCount <= 10) {
      setTicketCount(newCount);
    }
  };

  const getTotalAmount = () => {
    return (event?.price || 0) * ticketCount;
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Validate form
      if (!formData.name || !formData.email || !formData.phone) {
        alert('Please fill all required fields!');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Process payment (demo)
      processPayment();
    }
  };

  const processPayment = () => {
    // Demo payment processing
    setTimeout(() => {
      // Save booking to localStorage
      const booking = {
        event: event,
        tickets: ticketCount,
        totalAmount: getTotalAmount(),
        userDetails: formData,
        paymentMethod: paymentMethod,
        bookingDate: new Date().toISOString(),
        bookingId: 'BK' + Date.now()
      };

      // Save to user's bookings
      const existingBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
      existingBookings.push(booking);
      localStorage.setItem('myBookings', JSON.stringify(existingBookings));

      setStep(3);
    }, 2000);
  };

  if (!event) {
    return null;
  }

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
              {step !== 3 && (
                <button 
                  onClick={() => navigate(-1)}
                  className="flex items-center text-gray-700 hover:text-purple-600 transition"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center">
            {/* Step 1 */}
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > 1 ? <Check className="h-6 w-6" /> : '1'}
              </div>
              <span className="ml-2 font-medium text-gray-700">Details</span>
            </div>

            {/* Line */}
            <div className={`w-24 h-1 mx-4 ${step >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>

            {/* Step 2 */}
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > 2 ? <Check className="h-6 w-6" /> : '2'}
              </div>
              <span className="ml-2 font-medium text-gray-700">Payment</span>
            </div>

            {/* Line */}
            <div className={`w-24 h-1 mx-4 ${step >= 3 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>

            {/* Step 3 */}
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step >= 3 ? <Check className="h-6 w-6" /> : '3'}
              </div>
              <span className="ml-2 font-medium text-gray-700">Confirm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Booking Details */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Details</h2>

                {/* Ticket Quantity */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-3">
                    Number of Tickets
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleTicketChange(-1)}
                      className="w-12 h-12 bg-gray-200 rounded-lg font-bold text-gray-700 hover:bg-gray-300 transition"
                    >
                      -
                    </button>
                    <div className="w-20 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-purple-600">{ticketCount}</span>
                    </div>
                    <button
                      onClick={() => handleTicketChange(1)}
                      className="w-12 h-12 bg-gray-200 rounded-lg font-bold text-gray-700 hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                    <span className="text-gray-600">Max 10 tickets per booking</span>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                        placeholder="+91 1234567890"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition resize-none"
                      placeholder="Any special requirements or dietary restrictions..."
                    ></textarea>
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105 shadow-lg"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h2>

                {/* Payment Options */}
                <div className="space-y-4 mb-6">
                  <div 
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      paymentMethod === 'card' ? 'border-purple-600 bg-purple-50' : 'border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CreditCard className="h-6 w-6 text-purple-600 mr-3" />
                        <div>
                          <h3 className="font-semibold text-gray-800">Credit/Debit Card</h3>
                          <p className="text-sm text-gray-600">Visa, Mastercard, RuPay</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        paymentMethod === 'card' ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                      } flex items-center justify-center`}>
                        {paymentMethod === 'card' && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      paymentMethod === 'upi' ? 'border-purple-600 bg-purple-50' : 'border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-purple-600 rounded mr-3 flex items-center justify-center text-white font-bold text-xs">
                          UPI
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">UPI Payment</h3>
                          <p className="text-sm text-gray-600">Google Pay, PhonePe, Paytm</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        paymentMethod === 'upi' ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                      } flex items-center justify-center`}>
                        {paymentMethod === 'upi' && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      paymentMethod === 'netbanking' ? 'border-purple-600 bg-purple-50' : 'border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-blue-600 rounded mr-3 flex items-center justify-center text-white font-bold text-xs">
                          NB
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Net Banking</h3>
                          <p className="text-sm text-gray-600">All major banks</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        paymentMethod === 'netbanking' ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                      } flex items-center justify-center`}>
                        {paymentMethod === 'netbanking' && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Demo Payment Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Demo Mode:</strong> This is a demonstration. No actual payment will be processed.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105 shadow-lg"
                  >
                    Pay ₹{getTotalAmount()}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Booking Confirmed! 🎉</h2>
                <p className="text-gray-600 text-lg mb-8">
                  Your tickets have been booked successfully. A confirmation email has been sent to {formData.email}
                </p>

                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 mb-8">
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="text-sm text-gray-600">Booking ID</p>
                      <p className="font-bold text-gray-800">BK{Date.now()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Number of Tickets</p>
                      <p className="font-bold text-gray-800">{ticketCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-bold text-purple-600">₹{getTotalAmount()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-bold text-gray-800">{paymentMethod.toUpperCase()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link to="/my-bookings" className="flex-1">
                    <button className="w-full py-3 bg-purple-100 text-purple-700 rounded-lg font-semibold hover:bg-purple-200 transition">
                      View My Bookings
                    </button>
                  </Link>
                  <Link to="/events" className="flex-1">
                    <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition">
                      Browse More Events
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h3>
              
              {/* Event Details */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-800 mb-2">{event.title}</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-purple-600" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-purple-600" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Ticket Price</span>
                  <span>₹{event.price}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Quantity</span>
                  <span>×{ticketCount}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Platform Fee</span>
                  <span>₹0</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-800">
                  <span>Total Amount</span>
                  <span className="text-purple-600">₹{getTotalAmount()}</span>
                </div>
              </div>

              {/* Security Note */}
              {step !== 3 && (
                <div className="mt-6 p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-800">
                    🔒 Your payment information is secure and encrypted
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBooking;