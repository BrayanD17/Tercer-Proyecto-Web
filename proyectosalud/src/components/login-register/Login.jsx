// Login.jsx
import React from 'react';
import '../../styles/Login.css';

const Login = ({ onSubmit, onRegisterClick }) => {
  return (
    <div className="login-container">
      <h2 className="login-title">HealthSync</h2>
      <form className="login-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="username">Usuario:</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            placeholder="Ingresa tu usuario" 
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
