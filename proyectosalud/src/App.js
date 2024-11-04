import React from 'react';
import './App.css';
import LoginRegisterComponent from './components/login-register/LoginRegisterComponent'; // Importa el componente de login y registro
import { AuthProvider } from './components/context/AuthContext'; // Importa AuthProvider

function App() {
  return (
    <AuthProvider> {/* Envuelve la aplicación en AuthProvider */}
      <div className="App">
        <LoginRegisterComponent />
      </div>
    </AuthProvider>
  );
}

export default App;
