import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import UserProfile from './UserProfile';

const MainComponent = () => {
  const handleDataImport = (tipoDato, mensaje) => {
    console.log(`Tipo de dato importado: ${tipoDato}, Mensaje: ${mensaje}`);
  };

  const handleUserProfileClick = () => {
    window.location.href = '/perfil';
  };

  return (
    <Router>
      <div>
        <NavigationBar onImportData={handleDataImport} onUserProfileClick={handleUserProfileClick} />
        <Routes>
          <Route path="/perfil" element={<UserProfile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default MainComponent;
