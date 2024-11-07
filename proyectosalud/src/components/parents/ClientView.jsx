import React from 'react';
import NavigationBar from '../navbar-data/NavigationBar';
import Dashboard from '../dashboard/Dashboard';

const ClientView = () => {
  const handleImportData = (tipoDato, mensaje) => {
    console.log(`Datos importados: ${tipoDato} - ${mensaje}`);
  };

  const handleUserProfileClick = () => {
    console.log("Perfil de usuario abierto");
  };

  return (
    <div className="client-view">
      <NavigationBar onImportData={handleImportData} onUserProfileClick={handleUserProfileClick} />
      <Dashboard />
    </div>
  );
};

export default ClientView;
