import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavigationBar from './components/NavigationBar';
import UserProfile from './components/UserProfile'; // Importa el componente UserProfile
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const handleDataImport = (tipoDato, mensaje) => {
    console.log(`Tipo de dato importado: ${tipoDato}, Mensaje: ${mensaje}`);
  };

  const handleUserProfileClick = () => {
    // Aquí puedes manejar la redirección al perfil del usuario
    window.location.href = '/perfil'; // Redirige a la página de perfil
  };

  return (
    <Router>
      <div className="App">
        <NavigationBar onImportData={handleDataImport} onUserProfileClick={handleUserProfileClick} />
        <Routes>
          <Route path="/perfil" element={<UserProfile />} />
          {/* Define aquí otras rutas si es necesario */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
