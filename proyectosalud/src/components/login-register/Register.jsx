import React, { useState } from 'react';
import '../../styles/Register.css';

const Register = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    weight: '',
    height: '',
    birthdate: '',
    gender: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    onSubmit(); 
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Registro - Fit Connect</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="button-container">
          <button type="submit" className="btn-register">Registrarse</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
