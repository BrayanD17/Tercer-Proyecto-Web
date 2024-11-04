// src/components/login-register/LoginRegisterComponent.jsx
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import MainComponent from '../main-content/MainComponent';

const LoginRegisterComponent = () => {
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

  if (isLoggedIn) {
    return <MainComponent />;
  }

  return (
    <div>
      {isRegistering ? (
        <Register onSubmit={handleRegisterSubmit} />
      ) : (
        <Login onSubmit={handleLoginSubmit} onRegisterClick={handleRegisterClick} />
      )}
    </div>
  );
};

export default LoginRegisterComponent;
