// src/pages/EventDetails.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useParams, useNavigate } from 'react-router-dom';
// import { Calendar, MapPin, Clock, Users, Ticket, Share2, Bookmark, ArrowLeft, User, Mail, Phone, Heart, Star } from 'lucide-react';

// const EventDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [isSaved, setIsSaved] = useState(false);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   // Sample event data - Replace with API call based on id
//   const event = {
//     id: 1,
//     title: "Tech Conference 2026",
//     category: "Technology",
//     date: "Feb 15, 2026",
//     time: "10:00 AM - 6:00 PM",
//     location: "Grand Convention Center, Mumbai",
//     address: "123 Tech Street, Andheri East, Mumbai - 400069",
//     price: 2999,
//     image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop",
//     attendees: 250,
//     totalSeats: 500,
//     description: "Join us for the biggest tech conference of 2026! This event brings together industry leaders, innovators, and tech enthusiasts from across India. Explore cutting-edge technologies, attend insightful sessions, and network with like-minded professionals.",
//     highlights: [
//       "20+ Expert Speakers from top tech companies",
//       "Hands-on workshops on AI, ML, and Cloud Computing",
//       "Networking opportunities with industry leaders",
//       "Startup pitch competition with ₹5 Lakh prize",
//       "Certificate of participation",
//       "Lunch and refreshments included"
//     ],
//     schedule: [
//       { time: "10:00 AM", activity: "Registration & Welcome Coffee" },
//       { time: "11:00 AM", activity: "Keynote: Future of AI" },
//       { time: "12:30 PM", activity: "Panel Discussion: Cloud Computing" },
//       { time: "1:30 PM", activity: "Lunch Break" },
//       { time: "2:30 PM", activity: "Workshops (Multiple Tracks)" },
//       { time: "4:30 PM", activity: "Startup Pitch Competition" },
//       { time: "5:30 PM", activity: "Networking Session" },
//       { time: "6:00 PM", activity: "Closing Remarks" }
//     ],
//     organizer: {
//       name: "Tech Hub India",
//       email: "contact@techhubindia.com",
//       phone: "+91 9876543210",
//       about: "Tech Hub India is a leading technology community organization dedicated to promoting innovation and knowledge sharing in the tech industry."
//     },
//     tags: ["Technology", "AI", "Machine Learning", "Networking", "Innovation"]
//   };

//   const handleRegister = () => {
//     if (!user) {
//       alert('Please login to register for this event');
//       navigate('/login');
//       return;
//     }
//     // TODO: Navigate to registration/payment page
//     alert('Registration feature coming soon!');
//   };

//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: event.title,
//         text: event.description,
//         url: window.location.href
//       });
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       alert('Event link copied to clipboard!');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navbar */}
//       <nav className="bg-white shadow-md sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <Link to="/">
//                 <div className="flex items-center cursor-pointer">
//                   <Calendar className="h-8 w-8 text-purple-600" />
//                   <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//                     EventHub
//                   </span>
//                 </div>
//               </Link>
//             </div>
//             <div className="flex items-center space-x-4">
//               <Link to="/events">
//                 <button className="flex items-center text-gray-700 hover:text-purple-600 transition">
//                   <ArrowLeft className="h-5 w-5 mr-2" />
//                   Back to Events
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Event Banner */}
//       <div className="relative h-96 bg-gray-900">
//         <img 
//           src={event.image} 
//           alt={event.title}
//           className="w-full h-full object-cover opacity-80"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
//         <div className="absolute bottom-0 left-0 right-0 p-8">
//           <div className="max-w-7xl mx-auto">
//             <span className="inline-block px-4 py-2 bg-purple-600 text-white rounded-full font-semibold mb-4">
//               {event.category}
//             </span>
//             <h1 className="text-5xl font-bold text-white mb-4">{event.title}</h1>
//             <div className="flex flex-wrap gap-6 text-white">
//               <div className="flex items-center">
//                 <Calendar className="h-5 w-5 mr-2" />
//                 <span>{event.date}</span>
//               </div>
//               <div className="flex items-center">
//                 <Clock className="h-5 w-5 mr-2" />
//                 <span>{event.time}</span>
//               </div>
//               <div className="flex items-center">
//                 <MapPin className="h-5 w-5 mr-2" />
//                 <span>{event.location}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Event Details */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* About Event */}
//             <div className="bg-white rounded-xl shadow-md p-8">
//               <h2 className="text-3xl font-bold text-gray-800 mb-4">About This Event</h2>
//               <p className="text-gray-600 text-lg leading-relaxed mb-6">
//                 {event.description}
//               </p>
              
//               <h3 className="text-2xl font-bold text-gray-800 mb-4">What's Included</h3>
//               <ul className="space-y-3">
//                 {event.highlights.map((highlight, index) => (
//                   <li key={index} className="flex items-start">
//                     <Star className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
//                     <span className="text-gray-600">{highlight}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Event Schedule */}
//             <div className="bg-white rounded-xl shadow-md p-8">
//               <h2 className="text-3xl font-bold text-gray-800 mb-6">Event Schedule</h2>
//               <div className="space-y-4">
//                 {event.schedule.map((item, index) => (
//                   <div key={index} className="flex items-start border-l-4 border-purple-600 pl-6 py-2">
//                     <div className="flex-shrink-0 w-32">
//                       <span className="text-purple-600 font-bold">{item.time}</span>
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-gray-800 font-medium">{item.activity}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Organizer Info */}
//             <div className="bg-white rounded-xl shadow-md p-8">
//               <h2 className="text-3xl font-bold text-gray-800 mb-6">About the Organizer</h2>
//               <div className="flex items-start space-x-4 mb-6">
//                 <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
//                   {event.organizer.name.charAt(0)}
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-800">{event.organizer.name}</h3>
//                   <p className="text-gray-600 mt-2">{event.organizer.about}</p>
//                 </div>
//               </div>
//               <div className="space-y-3">
//                 <div className="flex items-center text-gray-600">
//                   <Mail className="h-5 w-5 mr-3 text-purple-600" />
//                   <a href={`mailto:${event.organizer.email}`} className="hover:text-purple-600">
//                     {event.organizer.email}
//                   </a>
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <Phone className="h-5 w-5 mr-3 text-purple-600" />
//                   <a href={`tel:${event.organizer.phone}`} className="hover:text-purple-600">
//                     {event.organizer.phone}
//                   </a>
//                 </div>
//               </div>
//             </div>

//             {/* Tags */}
//             <div className="bg-white rounded-xl shadow-md p-8">
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">Tags</h2>
//               <div className="flex flex-wrap gap-2">
//                 {event.tags.map((tag, index) => (
//                   <span 
//                     key={index}
//                     className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Booking Card */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-xl shadow-lg p-8 sticky top-24">
//               {/* Price */}
//               <div className="text-center mb-6">
//                 <div className="text-4xl font-bold text-purple-600 mb-2">
//                   ₹{event.price}
//                 </div>
//                 <p className="text-gray-600">per person</p>
//               </div>

//               {/* Availability */}
//               <div className="mb-6">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-gray-700 font-medium">Availability</span>
//                   <span className="text-purple-600 font-bold">
//                     {event.totalSeats - event.attendees} seats left
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
//                     style={{ width: `${(event.attendees / event.totalSeats) * 100}%` }}
//                   ></div>
//                 </div>
//                 <p className="text-sm text-gray-500 mt-1">
//                   {event.attendees} people already registered
//                 </p>
//               </div>

//               {/* Register Button */}
//               <button
//                 onClick={handleRegister}
//                 className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105 shadow-lg mb-4"
//               >
//                 Register Now
//               </button>

//               {/* Action Buttons */}
//               <div className="grid grid-cols-2 gap-3 mb-6">
//                 <button
//                   onClick={() => setIsSaved(!isSaved)}
//                   className={`py-3 rounded-lg font-medium transition flex items-center justify-center ${
//                     isSaved 
//                       ? 'bg-purple-100 text-purple-600' 
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   <Bookmark className={`h-5 w-5 mr-2 ${isSaved ? 'fill-current' : ''}`} />
//                   {isSaved ? 'Saved' : 'Save'}
//                 </button>
//                 <button
//                   onClick={handleShare}
//                   className="py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition flex items-center justify-center"
//                 >
//                   <Share2 className="h-5 w-5 mr-2" />
//                   Share
//                 </button>
//               </div>

//               {/* Event Info Summary */}
//               <div className="border-t pt-6 space-y-4">
//                 <div className="flex items-start">
//                   <Calendar className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
//                   <div>
//                     <p className="font-medium text-gray-800">Date & Time</p>
//                     <p className="text-gray-600 text-sm">{event.date}</p>
//                     <p className="text-gray-600 text-sm">{event.time}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <MapPin className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
//                   <div>
//                     <p className="font-medium text-gray-800">Location</p>
//                     <p className="text-gray-600 text-sm">{event.location}</p>
//                     <p className="text-gray-600 text-sm">{event.address}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <Users className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
//                   <div>
//                     <p className="font-medium text-gray-800">Attendees</p>
//                     <p className="text-gray-600 text-sm">{event.attendees} people registered</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Safety Note */}
//               <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//                 <p className="text-sm text-blue-800">
//                   <Heart className="h-4 w-4 inline mr-1" />
//                   Your safety is our priority. COVID-19 guidelines will be followed.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventDetails;

// src/pages/EventDetails.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Ticket, Share2, Bookmark, ArrowLeft, User, Mail, Phone, Heart, Star } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSaved, setIsSaved] = useState(false);
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Get event data from navigation state or fallback to sample
    if (location.state) {
      // Data passed from Events Listing page
      const passedEvent = location.state;
      setEvent({
        ...passedEvent,
        time: passedEvent.time || "10:00 AM - 6:00 PM",
        address: passedEvent.address || `${passedEvent.location}, India`,
        totalSeats: passedEvent.totalSeats || 500,
        description: `Join us for ${passedEvent.title}! This amazing event brings together enthusiasts and professionals. Don't miss this opportunity to be part of something special.`,
        highlights: [
          "Expert speakers and industry leaders",
          "Hands-on workshops and sessions",
          "Networking opportunities",
          "Certificate of participation",
          "Refreshments included",
          "Special giveaways and prizes"
        ],
        schedule: [
          { time: "10:00 AM", activity: "Registration & Welcome" },
          { time: "11:00 AM", activity: "Opening Keynote" },
          { time: "12:30 PM", activity: "Panel Discussion" },
          { time: "1:30 PM", activity: "Lunch Break" },
          { time: "2:30 PM", activity: "Workshops & Sessions" },
          { time: "4:30 PM", activity: "Interactive Activities" },
          { time: "5:30 PM", activity: "Networking Session" },
          { time: "6:00 PM", activity: "Closing Remarks" }
        ],
        organizer: {
          name: passedEvent.organizer || "EventHub Team",
          email: "contact@eventhub.com",
          phone: "+91 9876543210",
          about: "We are dedicated to creating memorable experiences and bringing people together through amazing events."
        },
        tags: [passedEvent.category, "Networking", "Community", "Experience"]
      });
    } else {
      // Fallback sample data if no state passed
      setEvent({
        id: id,
        title: "Sample Event",
        category: "General",
        date: "Coming Soon",
        time: "TBA",
        location: "To Be Announced",
        address: "Details will be updated soon",
        price: 0,
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop",
        attendees: 0,
        totalSeats: 100,
        description: "Event details will be updated soon. Please check back later.",
        highlights: ["More details coming soon"],
        schedule: [{ time: "TBA", activity: "Schedule will be announced" }],
        organizer: {
          name: "EventHub",
          email: "info@eventhub.com",
          phone: "+91 1234567890",
          about: "Event organizer details"
        },
        tags: ["Event"]
      });
    }
  }, [location, id]);

  const handleRegister = () => {
    if (!user) {
      alert('Please login to register for this event');
      navigate('/login');
      return;
    }
    // TODO: Navigate to registration/payment page
    navigate('/book-event', { state: { event } });
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

  // Show loading state if event data not yet loaded
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-16 w-16 text-purple-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
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
          src={event.image} 
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
                <span>{event.date}</span>
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
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {event.description}
              </p>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4">What's Included</h3>
              <ul className="space-y-3">
                {event.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <Star className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Event Schedule */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Event Schedule</h2>
              <div className="space-y-4">
                {event.schedule.map((item, index) => (
                  <div key={index} className="flex items-start border-l-4 border-purple-600 pl-6 py-2">
                    <div className="flex-shrink-0 w-32">
                      <span className="text-purple-600 font-bold">{item.time}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">{item.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Organizer Info */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">About the Organizer</h2>
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {event.organizer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{event.organizer.name}</h3>
                  <p className="text-gray-600 mt-2">{event.organizer.about}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-3 text-purple-600" />
                  <a href={`mailto:${event.organizer.email}`} className="hover:text-purple-600">
                    {event.organizer.email}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-3 text-purple-600" />
                  <a href={`tel:${event.organizer.phone}`} className="hover:text-purple-600">
                    {event.organizer.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Tags */}
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
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-24">
              {/* Price */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  ₹{event.price}
                </div>
                <p className="text-gray-600">per person</p>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-medium">Availability</span>
                  <span className="text-purple-600 font-bold">
                    {event.totalSeats - event.attendees} seats left
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                    style={{ width: `${(event.attendees / event.totalSeats) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {event.attendees} people already registered
                </p>
              </div>

              {/* Register Button */}
              <button
                onClick={handleRegister}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105 shadow-lg mb-4"
              >
                Register Now
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
                    <p className="text-gray-600 text-sm">{event.date}</p>
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
                    <p className="text-gray-600 text-sm">{event.attendees} people registered</p>
                  </div>
                </div>
              </div>

              {/* Safety Note */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Heart className="h-4 w-4 inline mr-1" />
                  Your safety is our priority. COVID-19 guidelines will be followed.
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