import React, { useState, useContext } from 'react';
import Login from '../login-register/Login';
import Register from '../login-register/Register';
import ClientView from './ClientView';
import { AuthContext } from '../../context/AuthContext';

const LoginRegisterComponent = () => {
  const { username } = useContext(AuthContext);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleRegisterClick = () => {
    setIsRegistering(true); 
  };

  const handleLoginSubmit = () => {
    setIsLoggedIn(true);
  };

  const handleRegisterSubmit = () => {
    setIsRegistering(false);
  };

  const handleCancel = () => {
    setIsRegistering(false); 
  };

  const handleLogout = () => {
    setIsLoggedIn(false); 
  };
  
  if (isLoggedIn) {
    return <ClientView username={username} onLogout={handleLogout} />; 
  }

  return (
    <div>
      {isRegistering ? (
        <Register onSubmit={handleRegisterSubmit} onCancel={handleCancel} />
      ) : (
        <Login onSubmit={handleLoginSubmit} onRegisterClick={handleRegisterClick} />
      )}
    </div>
  );
};

export default LoginRegisterComponent;
