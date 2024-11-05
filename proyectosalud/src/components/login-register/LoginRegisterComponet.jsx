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

  const handleCancel = () => {
    setIsRegistering(false); // Cambia a Login al hacer clic en Cancelar
  };

  if (isLoggedIn) {
    return <MainComponent />;
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
