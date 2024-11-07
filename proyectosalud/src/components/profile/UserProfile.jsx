import React from 'react';
import '../../styles/UserProfile.css';
import { LogOut, User, Edit3, Lock, ChevronRight, Home } from 'lucide-react';
import LogoHealthSync from '../../images/logoHealthSync.png';

const UserProfile = ({ onClose, onViewProfile, onEditProfile, onChangePassword, onLogout, onDashboard }) => {
  return (
    <>
      <div className="user-profile-overlay" onClick={onClose}></div>
      <div className="user-profile-panel">
        <div className="user-profile-header">
          <img src={LogoHealthSync} alt="HealthSync Logo" className="user-profile-logo" />
          <button className="close-btn" onClick={onClose}>
            <ChevronRight size={24} />
          </button>
        </div>
        
        <h2 className="user-profile-title">Opciones de Usuario</h2>
        
        <ul className="profile-options">
          <li onClick={() => { onDashboard(); onClose(); }}>
            <Home size={20} className="profile-option-icon" />
            Inicio
          </li>
          <li onClick={() => { onViewProfile(); onClose(); }}>
            <User size={20} className="profile-option-icon" />
            Ver perfil
          </li>
          <li onClick={() => { onEditProfile(); onClose(); }}>
            <Edit3 size={20} className="profile-option-icon" />
            Editar perfil
          </li>
          <li onClick={onChangePassword}>
            <Lock size={20} className="profile-option-icon" />
            Cambiar contraseña
          </li>
        </ul>

        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={20} className="logout-icon" />
          Cerrar sesión
        </button>
      </div>
    </>
  );
};

export default UserProfile;
