import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom'

import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

import './App.css';

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
  };

  return (
    <Router>
      <React.Fragment>
        <AuthContext.Provider 
          value={{ 
            token, 
            userId, 
            login, 
            logout
          }}
        >
          <MainNavigation />
          <main className='main-content'>
            <Routes>
              {!token && <Route path='/' exact element={<Navigate to='/auth' />} />}
              {token && <Route path='/' exact element={<Navigate to='/events' />} />}
              {token && <Route path='/auth' exact element={<Navigate to='/events' />} />}
              {!token && <Route path='/auth' element={<AuthPage />} />}
              <Route path='/events' element={<EventsPage />} />
              {token && (
                <Route path='/bookings' element={<BookingsPage />} />
              )}
            </Routes>
          </main>
        </AuthContext.Provider>
      </React.Fragment>
      
      
    </Router>
  );
  
}

export default App;
