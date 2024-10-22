import React, { useState } from 'react';
import Background from './Background';
import ImportDataForm from './ImportDataForm';
import '../styles/NavigationBar.css';

const NavigationBar = ({ onImportData }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [message, setMessage] = useState(''); // Para manejar mensajes

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
        <h1 className="title">Dashboard</h1>
        <button className="button" onClick={handleImportClick}>+ Importar CSV</button>
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
