import React from 'react';
import '../styles/UserProfile.css'; // Agrega estilos personalizados para este componente

const UserProfile = () => {
  return (
    <div className="user-profile">
      <h2>Perfil de Usuario</h2>
      <p>Nombre: Juan Pérez</p>
      <p>Email: juan.perez@example.com</p>
      <p>Edad: 30</p>
      {/* Aquí puedes agregar más detalles del perfil */}
    </div>
  );
};

export default UserProfile;
