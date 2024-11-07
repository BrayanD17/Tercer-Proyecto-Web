import React, { useState, useContext } from 'react';
import NavigationBar from '../navbar-data/NavigationBar';
import Dashboard from '../dashboard/Dashboard';
import ViewProfile from '../profile/ViewProfile';
import EditProfile from '../profile/EditProfile';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/ClientView.css';

const ClientView = ({ username }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { logout } = useContext(AuthContext);

  const handleImportData = (tipoDato, mensaje) => {
    console.log(`Datos importados: ${tipoDato} - ${mensaje}`);
  };

  const handleViewProfile = () => {
    setCurrentView('profile');
  };

  const handleEditProfile = () => {
    setCurrentView('editProfile');
  };

  const handleDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    logout();
    setCurrentView('dashboard'); 
  };

  return (
    <div className="client-view">
      <NavigationBar 
        onImportData={handleImportData} 
        onDashboard={handleDashboard} 
        onViewProfile={handleViewProfile} 
        onEditProfile={handleEditProfile}
      />
      
      <div className={`view-container ${currentView === 'dashboard' ? 'show' : 'hide'}`}>
        <Dashboard />
      </div>
      <div className={`view-container ${currentView === 'profile' ? 'show' : 'hide'}`}>
        <ViewProfile username={username} />
      </div>
      <div className={`view-container ${currentView === 'editProfile' ? 'show' : 'hide'}`}>
        <EditProfile username={username} onLogout={handleLogout} onEditComplete={handleDashboard} />
      </div>
    </div>
  );
};

export default ClientView;
