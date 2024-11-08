import React, { useEffect, useState, useContext } from 'react';
import '../../styles/ViewProfile.css';
import LogoHealthSync from '../../images/logoHealthSync.png';
import { AuthContext } from '../../context/AuthContext';

const ViewProfile = ({ username, profileUpdated }) => {
  const { getUserProfile } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const userData = await getUserProfile(username);
      setProfile(userData);
    };
    fetchProfile();
  }, [username, profileUpdated, getUserProfile]);

  if (!profile) {
    return <div className="loading">Cargando perfil...</div>;
  }

  return (
    <div className="view-profile">
      <div className="view-profile-header">
        <img src={LogoHealthSync} alt="HealthSync Logo" className="view-profile-logo" />
        <h2 className="view-profile-title">Perfil del Usuario</h2>
      </div>
      <div className="profile-info">
        <div className="profile-item">
          <span className="profile-label">Correo electrónico:</span>
          <span className="profile-value">{profile.email}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Nombre de usuario:</span>
          <span className="profile-value">{profile.username}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Peso actual:</span>
          <span className="profile-value">{profile.current_weight} kg</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Altura actual:</span>
          <span className="profile-value">{profile.current_height} cm</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Fecha de nacimiento:</span>
          <span className="profile-value">{formatDate(profile.birthday)}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Género:</span>
          <span className="profile-value">{profile.gender}</span>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
