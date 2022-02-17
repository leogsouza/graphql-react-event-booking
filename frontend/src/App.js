import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom'

import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';

import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" exact element={<Navigate to="/auth" />} />
      <Route path='/auth' element={<AuthPage />} />
      <Route path='/events' element={<EventsPage />} />
      <Route path='/bookings' element={<BookingsPage />} />
      </Routes>
      
    </Router>
  );
  
}

export default App;
