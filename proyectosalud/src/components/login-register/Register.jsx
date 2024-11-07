import React, { useState, useContext, useEffect } from 'react';
import '../../styles/Register.css';
import { AuthContext } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import LogoHealthSync from '../../images/logoHealthSync.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = ({ onSubmit, onCancel }) => {
  const { register, getUsernames } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    current_weight: '',
    current_height: '',
    birthday: '',
    gender: 'Masculino'
  });
  const [usernames, setUsernames] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    const fetchUsernames = async () => {
      const usernamesList = await getUsernames();
      setUsernames(usernamesList);
    };
    fetchUsernames();
  }, [getUsernames]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Ingrese un correo electrónico válido.";
    }
    return "";
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 10;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!minLength) return "Incluir al menos 10 caracteres.";
    if (!hasLetter) return "Incluir al menos una letra.";
    if (!hasNumber) return "Incluir al menos un número.";
    if (!hasSymbol) return "Incluir al menos un símbolo.";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario completo
    const isFormComplete = Object.values(formData).every((value) => value !== '');
    if (!isFormComplete) {
      toast.error('Por favor, completa todos los campos antes de registrar.');
      return;
    }

    // Validar correo electrónico
    const emailValidationMessage = validateEmail(formData.email);
    if (emailValidationMessage) {
      setEmailError(emailValidationMessage);
      return;
    } else {
      setEmailError('');
    }

    // Validar nombre de usuario único
    if (usernames.includes(formData.username)) {
      toast.error("El nombre de usuario ya está en uso. Elige otro.");
      return;
    }

    // Validar contraseña
    const passwordValidationMessage = validatePassword(formData.password);
    if (passwordValidationMessage) {
      setPasswordError(passwordValidationMessage);
      return;
    } else {
      setPasswordError('');
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    // Validar peso y altura
    const currentWeight = parseFloat(formData.current_weight);
    const currentHeight = parseFloat(formData.current_height);

    if (isNaN(currentWeight) || currentWeight <= 0) {
      toast.error('El peso debe ser un valor positivo en kg.');
      return;
    }

    if (isNaN(currentHeight) || currentHeight <= 0) {
      toast.error('La altura debe ser un valor positivo en cm.');
      return;
    }

    const birthdayFormatted = `${formData.birthday} 00:00:00`;
    const userData = {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      birthday: birthdayFormatted,
      gender: formData.gender,
      current_weight: currentWeight,
      current_height: currentHeight
    };

    const success = await register(userData);
    if (success) {
      toast.success("Registro exitoso", { autoClose: 5000 });
      setTimeout(onSubmit, 1000);
    } else {
      toast.error("Error en el registro");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="register-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="register-header">
        <img src={LogoHealthSync} alt="Logo HealthSync" className="register-logo" />
        <h2 className="register-title">Registro</h2>
      </div>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-columns">
          <div className='column-inputs'>
            <div className='email-container'>
              <label className='email-label' htmlFor="email">Correo:</label>
              <input 
                className='email-input' 
                type="email" 
                id="email" 
                name="email" 
                onChange={(e) => {
                  handleChange(e);
                  setEmailError(validateEmail(e.target.value));
                }} 
                required 
              />
              {emailError && <span className="error-message">{emailError}</span>}
            </div>
            <div className='username-container'>
              <label className='username-label' htmlFor="username">Usuario:</label>
              <input className='username-input' type="text" id="username" name="username" onChange={handleChange} required />
            </div>
            <div className='password-container'>
              <label className='password-label' htmlFor="password">Contraseña:</label>
              <div className='input-wrapper'>
                <input 
                  className='password-input'
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  onChange={(e) => {
                    handleChange(e);
                    setPasswordError(validatePassword(e.target.value));
                  }}
                  required
                />
                <span className="eye-icon" onClick={togglePasswordVisibility}>
                  {showPassword ? <EyeOff /> : <Eye />}
                </span>
              </div>
              {passwordError && <span className="error-message">{passwordError}</span>}
            </div>
            <div className='password-container'>
              <label className='password-label' htmlFor="confirmPassword">Confirmar Contraseña:</label>
              <div className='input-wrapper'>
                <input 
                  className='password-input'
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={handleChange}
                  required
                />
                <span className="eye-icon" onClick={toggleConfirmPasswordVisibility}>
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
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
              <input className='current-weight-input' type="number" step="0.1" id="current_weight" name="current_weight" onChange={handleChange} required />
            </div>
            <div className='current-height-container'>
              <label className='current-height-label' htmlFor="current_height">Altura actual (cm):</label>
              <input className='current-height-input' type="number" step="0.1" id="current_height" name="current_height" onChange={handleChange} required /> 
            </div>
          </div>
        </div>
        <div className='boton-container'>
          <button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="btn-register">Registrarse</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
