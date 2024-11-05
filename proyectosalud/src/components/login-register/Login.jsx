import React, { useState } from 'react';
import '../../styles/Login.css';
import { Eye, EyeOff } from 'lucide-react'; 
import LogoHealthSync from '../../images/logoHealthSync.png';

const Login = ({ onSubmit, onRegisterClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img src={LogoHealthSync} alt="Logo" className="login-logo" />
        <form onSubmit={handleSubmit} className="login-form">
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
          <div className="login-form-group">
            <label htmlFor="password" className="login-label">Contraseña</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                placeholder="Ingresa tu contraseña"
                required
              />
              <span className="eye-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <EyeOff /> : <Eye />}
              </span>
            </div>
          </div>
          <div className="login-button-group">
            <button type="submit" className="login-button login-button-login">Iniciar sesión</button>
            <button type="button" onClick={onRegisterClick} className="login-button login-button-register">Crear cuenta</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
