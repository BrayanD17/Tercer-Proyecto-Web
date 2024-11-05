// src/components/login-register/Register.jsx
import React, { useState, useContext } from 'react';
import '../../styles/Register.css';
import { AuthContext } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import LogoHealthSync from '../../images/logoHealthSync.png'; // Importa el logo aquí

const Register = ({ onSubmit, onCancel }) => {
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
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormComplete = Object.values(formData).every((value) => value !== '');
    if (!isFormComplete) {
      alert('Por favor, completa todos los campos antes de registrar.');
      return;
    }

    const success = await register(formData);
    if (success) {
      alert("Registro exitoso");
      onSubmit();
    } else {
      alert("Error en el registro");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <img src={LogoHealthSync} alt="Logo HealthSync" className="register-logo" />
        <h2 className="register-title">Registro</h2>
      </div>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className='column-inputs'>
          <div className='email-container'>
            <label className='email-label' htmlFor="email">Correo:</label>
            <input className='email-input' type="email" id="email" name="email" onChange={handleChange} required />
          </div>
          <div className='username-container'>
            <label className='username-label' htmlFor="username">Usuario:</label>
            <input className='username-input' type="text" id="username" name="username" onChange={handleChange} required />
          </div>
          <div className='password-container'>
            <label className='password-label' htmlFor="password">Contraseña:</label>
            <div className='input-wrapper'>
              <input className='password-input'
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                onChange={handleChange}
                required
              />
              <span className="eye-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <EyeOff /> : <Eye />}
              </span>
            </div>
          </div>
        </div>
        <div className='column-selects-dataInput'>
          <div className='gender-container'>
            <label className='gender-label' htmlFor="gender">Género:</label>
            <select className='gender-select' id="gender" name="gender" onChange={handleChange} required>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>
          <div className='birthday-container'>
            <label className='birthday-label' htmlFor="birthday">Fecha de nacimiento:</label>
            <input className='birthday-input' type="date" id="birthday" name="birthday" onChange={handleChange} required />
          </div>
          <div className='current-weight-container'>
            <label className='current-weight-label' htmlFor="current_weight">Peso actual (kg):</label>
            <input className='current-weight-input' type="number" id="current_weight" name="current_weight" onChange={handleChange} required />
          </div>
          <div className='current-height-container'>
            <label className='current-height-label' htmlFor="current_height">Altura actual (cm):</label>
            <input className='current-height-input' type="number" id="current_height" name="current_height" onChange={handleChange} required /> 
          </div>
        </div>
      </form>
      <div className="button-container"> 
          <button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="btn-register">Registrarse</button>
        </div>
    </div>
  );
};

export default Register;
