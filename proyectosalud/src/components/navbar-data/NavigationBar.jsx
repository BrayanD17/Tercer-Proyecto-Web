import React, { useState } from 'react';
import Background from './Background';
import ImportDataForm from './ImportDataForm';
import UserProfile from '../profile/UserProfile';
import '../../styles/NavigationBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faArrowUpFromBracket, faBars } from '@fortawesome/free-solid-svg-icons';

const NavigationBar = ({ onImportData, onDashboard, onViewProfile, onEditProfile }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isUserProfileVisible, setIsUserProfileVisible] = useState(false);
  const [message, setMessage] = useState('');

  const handleImportClick = () => {
    setIsFormVisible(true);
  };

  const handleImportSubmit = (tipoDato, mensaje) => {
    setMessage(`Datos importados: ${tipoDato} - ${mensaje}`);
    setIsFormVisible(false);
    if (onImportData) {
      onImportData(tipoDato, mensaje);
    }
  };

  const handleCancelClick = () => {
    setIsFormVisible(false);
  };

  const toggleUserProfile = () => {
    setIsUserProfileVisible(!isUserProfileVisible);
  };

  return (
    <div className={`app-container ${isUserProfileVisible ? 'shift-left' : ''}`}>
      <nav className="navbar">
        <div className="user-profile-container">
          <FontAwesomeIcon
            icon={faBars}
            className="user-icon"
            style={{ color: '#ffffff', fontSize: '24px', cursor: 'pointer' }}
            onClick={toggleUserProfile}
            title="Menú de usuario"
          />
        </div>
        <div className="import-data-icon" onClick={handleImportClick} title="Importar datos de sensores">
          <FontAwesomeIcon icon={faArrowUpFromBracket} style={{ color: '#ffffff', fontSize: '24px' }} />
        </div>
      </nav>

      {isUserProfileVisible && (
        <UserProfile 
          onClose={toggleUserProfile} 
          onDashboard={onDashboard} 
          onViewProfile={onViewProfile} 
          onEditProfile={onEditProfile}
        />
      )}

      {isFormVisible && (
        <Background>
          <ImportDataForm
            onSubmit={handleImportSubmit}
            onCancel={handleCancelClick}
          />
        </Background>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default NavigationBar;
