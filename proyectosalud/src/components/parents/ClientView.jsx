import React, { useState, useContext } from 'react';
import NavigationBar from '../navbar-data/NavigationBar';
import Dashboard from '../dashboard/Dashboard';
import ViewProfile from '../profile/ViewProfile';
import EditProfile from '../profile/EditProfile';
import ChangePass from '../profile/ChangePass';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/ClientView.css';

const ClientView = ({ username, onLogout }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [profileUpdated, setProfileUpdated] = useState(false);
  const { logout } = useContext(AuthContext);

  const handleEditComplete = () => {
    setProfileUpdated(!profileUpdated); 
    setCurrentView('profile'); 
  };

  const handleImportData = (tipoDato, mensaje) => {
    console.log(`Datos importados: ${tipoDato} - ${mensaje}`);
  };

  const handleViewProfile = () => {
    setCurrentView('profile');
    setProfileUpdated(false);
  };

  const handleEditProfile = () => {
    setCurrentView('editProfile');
  };

  const handleDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleChangePassword = () => {
    setCurrentView('changePass');
  };

  const handleLogout = () => {
    logout();  
    onLogout();  
  };

  return (
    <div className="client-view">
      <NavigationBar 
        onImportData={handleImportData} 
        onDashboard={handleDashboard} 
        onViewProfile={handleViewProfile} 
        onEditProfile={handleEditProfile}
        onChangePassword={handleChangePassword}
        onLogout={handleLogout}
      />
      
      <div className={`view-container ${currentView === 'dashboard' ? 'show' : 'hide'}`}>
        <Dashboard />
      </div>
      <div className={`view-container ${currentView === 'profile' ? 'show' : 'hide'}`}>
        <ViewProfile username={username} profileUpdated={profileUpdated} />
      </div>
      <div className={`view-container ${currentView === 'editProfile' ? 'show' : 'hide'}`}>
        <EditProfile username={username} onLogout={handleLogout} onEditComplete={handleEditComplete} />
      </div>
      <div className={`view-container ${currentView === 'changePass' ? 'show' : 'hide'}`}>
        <ChangePass onLogout={handleLogout} />
      </div>
    </div>
  );
};

export default ClientView;
