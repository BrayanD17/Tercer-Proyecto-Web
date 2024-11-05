// src/components/login-register/Login.jsx
import React, { useState } from 'react';
import '../../styles/Login.css';
import { Eye, EyeOff } from 'lucide-react'; // Importa los iconos de Lucide
import LogoHealthSync from '../../images/logoHealthSync.png'; // Cambia el logo si es necesario

const Login = ({ onSubmit, onRegisterClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(username, password); // Llamamos a la función de login
  };

  return (
    <div className="login-container">
      <img src={LogoHealthSync} alt="Logo" className="login-logo" /> {/* Cambia el logo si es necesario */}
      <form onSubmit={handleSubmit}>
        <div className="login-form-group">
          <label htmlFor="username" className="login-label">Usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            placeholder="Ingresa tu usuario"
            required
          />
        </div>
        <div className="login-form-group" style={{ position: "relative" }}>
          <label htmlFor="password" className="login-label">Contraseña</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            placeholder="Ingresa tu contraseña"
            required
          />
          {/* Ícono para mostrar/ocultar la contraseña */}
          <span className="eye-icon" onClick={togglePasswordVisibility}>
            {showPassword ? <EyeOff /> : <Eye />}
          </span>
        </div>
        <div className="login-button-group">
          <button type="submit" className="login-button login-button-login">Iniciar sesión</button>
          <button type="button" onClick={onRegisterClick} className="login-button login-button-register">Crear cuenta</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
