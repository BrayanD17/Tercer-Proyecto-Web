// src/components/login-register/Register.jsx
import React, { useState, useContext } from 'react';
import '../../styles/Register.css';
import { AuthContext } from '../context/AuthContext'; // Importar el contexto de autenticación

const Register = ({ onSubmit }) => {
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    current_weight: '',
    current_height: '',
    birthday: '',
    gender: 'Masculino'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) {
      alert("Registro exitoso");
      onSubmit();
    } else {
      alert("Error en el registro");
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Registro - Fit Connect</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo:</label>
          <input type="email" id="email" name="email" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="username">Usuario:</label>
          <input type="text" id="username" name="username" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" name="password" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="current_weight">Peso actual (kg):</label>
          <input type="number" id="current_weight" name="current_weight" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="current_height">Altura actual (cm):</label>
          <input type="number" id="current_height" name="current_height" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="birthday">Fecha de nacimiento:</label>
          <input type="date" id="birthday" name="birthday" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Género:</label>
          <select id="gender" name="gender" onChange={handleChange} required>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>
        <div className="button-container">
          <button type="submit" className="btn-register">Registrarse</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
