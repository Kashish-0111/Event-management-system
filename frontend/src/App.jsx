// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import EventListingpage from "./pages/Eventlistingpage.jsx"
import UserDashboard from "./pages/UserDashboard.jsx";
import EventDetails  from './pages/EventDetails.jsx';
import CreateEvent from './pages/CreateEvent.jsx';

import OrganizerDashboard from './pages/OrgainzerDashboard.jsx';
import EventBooking from './pages/EventBooking.jsx';
import MyBookings from './pages/MyBookings.jsx';
import ViewRegistrations from './pages/ViewRegistrations.jsx';

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventListingpage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} /> */}
<Route path="/events/:id" element={<EventDetails />} />
<Route path="/create-event" element={<CreateEvent />} />
<Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
<Route path="/book-event" element={<EventBooking />} />
<Route path="/my-bookings" element={<MyBookings />} />
<Route path="/view-registrations/:eventId" element={<ViewRegistrations />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>

      </Router>
    </AuthProvider>
  );
}

export default App;