import React, { useState } from 'react';
import Background from './Background';
import ImportDataForm from './ImportDataForm';
import '../../styles/NavigationBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importa FontAwesomeIcon
import { faArrowUpFromBracket, faCircleUser } from '@fortawesome/free-solid-svg-icons'; // Importa los íconos

const NavigationBar = ({ onImportData, onUserProfileClick }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [message, setMessage] = useState('');

  const handleImportClick = () => {
    setIsFormVisible(true);
  };

  const handleImportSubmit = (tipoDato, mensaje) => {
    setMessage(`Datos importados: ${tipoDato} - ${mensaje}`);
    setIsFormVisible(false); // Cerrar el formulario después de la importación
    if (onImportData) {
      onImportData(tipoDato, mensaje);
    }
  };

  const handleCancelClick = () => {
    setIsFormVisible(false);
  };

  return (
    <>
      <nav className="navbar">
        {/* Nombre de nuestro Proyecto*/}
        <h1 className="title">HealthSync</h1>

        {/* Icono para importar CSV con FontAwesomeIcon */}
        <div className="import-data-icon" onClick={handleImportClick} title="Importar datos de sensores">
          <FontAwesomeIcon icon={faArrowUpFromBracket} style={{ color: '#ffffff', fontSize: '24px' }} />
        </div>

        {/* Reemplazar imagen de usuario por el ícono circle-user */}
        <FontAwesomeIcon
          icon={faCircleUser}
          className="user-icon"
          style={{ color: '#ffffff', fontSize: '40px', cursor: 'pointer' }}
          onClick={onUserProfileClick} // Redirigir al perfil al hacer clic
          title="Perfil de usuario"
        />
      </nav>

      {isFormVisible && (
        <Background>
          <ImportDataForm
            onSubmit={handleImportSubmit}
            onCancel={handleCancelClick}
          />
        </Background>
      )}

      {message && <p>{message}</p>} {/* Mostrar mensaje de importación */}
    </>
  );
};

export default NavigationBar;
