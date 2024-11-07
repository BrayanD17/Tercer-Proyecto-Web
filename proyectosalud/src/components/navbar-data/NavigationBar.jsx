import React, { useState } from 'react';
import Background from './Background';
import ImportDataForm from './ImportDataForm';
import UserProfile from './UserProfile'; // Importar UserProfile
import '../../styles/NavigationBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faArrowUpFromBracket, faCircleUser } from '@fortawesome/free-solid-svg-icons';

const NavigationBar = ({ onImportData, onUserProfileClick }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isUserProfileVisible, setIsUserProfileVisible] = useState(false); // Estado para mostrar UserProfile
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
    <>
      <nav className="navbar">
        <h1 className="title">HealthSync</h1>

        <div className="import-data-icon" onClick={handleImportClick} title="Importar datos de sensores">
          <FontAwesomeIcon icon={faArrowUpFromBracket} style={{ color: '#ffffff', fontSize: '24px' }} />
        </div>

        {/* Icono de usuario */}
        <div className="user-profile-container">
          <FontAwesomeIcon
            icon={faCircleUser}
            className="user-icon"
            style={{ color: '#ffffff', fontSize: '40px', cursor: 'pointer' }}
            onClick={toggleUserProfile}
            title="Perfil de usuario"
          />
          {isUserProfileVisible && (
            <div className="user-profile">
              <UserProfile />
            </div>
          )}
        </div>
      </nav>

      {isFormVisible && (
        <Background>
          <ImportDataForm
            onSubmit={handleImportSubmit}
            onCancel={handleCancelClick}
          />
        </Background>
      )}

      {message && <p>{message}</p>}
    </>
  );
};

export default NavigationBar;
