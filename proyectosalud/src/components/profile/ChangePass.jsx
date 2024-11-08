// ChangePass.jsx
import React, { useState, useContext } from 'react';
import '../../styles/ChangePass.css';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

const ChangePass = ({ onLogout }) => {
  const { changePassword, username } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Función para validar la contraseña
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

  // Función para mostrar notificaciones de toast
  const showToast = (message, type = "error") => {
    try {
      if (type === "success") {
        toast.success(message, { autoClose: 3000 });
      } else {
        toast.error(message, { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error en toast:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      console.error("Username is not available");
      showToast("El nombre de usuario no está disponible.");
      return;
    }
    if (newPassword === currentPassword) {
      showToast("La nueva contraseña no puede ser igual a la actual.");
      return;
    }

    const passwordValidationMessage = validatePassword(newPassword);
    if (passwordValidationMessage) {
      setPasswordError(passwordValidationMessage);
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Las contraseñas no coinciden.");
      return;
    }

    console.log("Enviando datos para cambiar contraseña:", { username, currentPassword, newPassword });
    const success = await changePassword(username, currentPassword, newPassword);
    if (success) {
      showToast("Contraseña actualizada exitosamente. Será redirigido a la pantalla de inicio de sesión.", "success");
      setTimeout(onLogout, 3000);
    } else {
      showToast("Error al cambiar la contraseña. Verifique la contraseña actual.");
    }
};

  return (
    <div className="change-pass-container">
      <h2>Cambiar Contraseña</h2>
      <form onSubmit={handleSubmit} className="change-pass-form">
        <div className="form-group">
          <label>Contraseña Actual:</label>
          <div className="input-wrapper">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <span className="eye-icon" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
              {showCurrentPassword ? <EyeOff /> : <Eye />}
            </span>
          </div>
        </div>
        <div className="form-group">
          <label>Nueva contraseña:</label>
          <div className="input-wrapper">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordError(validatePassword(e.target.value));
              }}
              required
            />
            <span className="eye-icon" onClick={() => setShowNewPassword(!showNewPassword)}>
              {showNewPassword ? <EyeOff /> : <Eye />}
            </span>
          </div>
          {passwordError && <span className="error-message">{passwordError}</span>}
        </div>
        <div className="form-group">
          <label>Confirmar nueva contraseña:</label>
          <div className="input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </span>
          </div>
        </div>
        <button type="submit" className="btn-change-pass">Cambiar Contraseña</button>
      </form>
    </div>
  );
};

export default ChangePass;
