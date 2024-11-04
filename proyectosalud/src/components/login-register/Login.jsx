// src/components/login-register/Login.jsx
import React, { useState, useContext } from 'react';
import '../../styles/Login.css';
import { AuthContext } from '../context/AuthContext'; // Asegúrate de que el contexto esté bien importado

const Login = ({ onRegisterClick }) => {
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(credentials.username, credentials.password);
    if (!success) {
      alert("Error en el inicio de sesión");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">HealthSync</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Usuario:</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            placeholder="Ingresa tu usuario" 
            value={credentials.username}
            onChange={handleChange}
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="Ingresa tu contraseña" 
            value={credentials.password}
            onChange={handleChange}
            required 
          />
        </div>
        <div className="button-container">
          <button type="submit" className="btn-login">Iniciar sesión</button>
          <button type="button" className="btn-register" onClick={onRegisterClick}>Registrarse</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
