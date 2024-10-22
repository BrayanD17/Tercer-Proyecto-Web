import React from 'react';
import './App.css';
import NavigationBar from './components/NavigationBar'; // Asegúrate de que la ruta sea correcta

function App() {
  // Esta función maneja la importación de datos desde el formulario
  const handleDataImport = (tipoDato, mensaje) => {
    // Aquí puedes manejar lo que quieras hacer con los datos importados
    console.log(`Tipo de dato importado: ${tipoDato}, Mensaje: ${mensaje}`);
    // Puedes agregar más lógica aquí, como mostrar notificaciones, actualizar estado, etc.
  };

  return (
    <div className="App">
      <NavigationBar onImportData={handleDataImport} />
    </div>
  );
}

export default App;
