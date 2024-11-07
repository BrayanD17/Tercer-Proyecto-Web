import React, { useState, useContext, useEffect } from 'react';
import '../../styles/EditProfile.css';
import { AuthContext } from '../../context/AuthContext';
import { Pencil } from 'lucide-react';
import LogoHealthSync from '../../images/logoHealthSync.png';

const EditProfile = ({ username, onLogout, onEditComplete }) => {
  const { getUserProfile, updateUserProfile, getUsernames, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [editableField, setEditableField] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserProfile(username);
      setUserData(data);
    };
    fetchUserData();
  }, [getUserProfile, username]);

  const handleEditClick = (field) => {
    setEditableField(field);
    setErrorMessage('');
  };

  const handleSaveClick = async (field) => {
    if (field === 'username' && newUsername !== userData.username) {
      const usernames = await getUsernames();
      if (usernames.includes(newUsername)) {
        setErrorMessage('El nombre de usuario ya está en uso');
        return;
      }
      setUserData((prevData) => ({ ...prevData, username: newUsername }));
      await updateUserProfile(username, { username: newUsername });
      await logout();
      onLogout();
      return; 
    }

    await updateUserProfile(username, { [field]: userData[field] });
    setEditableField(null);
    onEditComplete();
  };

  const handleChange = (field, value) => {
    setUserData((prevData) => ({ ...prevData, [field]: value }));
  };

  if (!userData) return <p>Cargando datos...</p>;

  return (
    <div className="edit-profile">
      <div className="header">
        <img src={LogoHealthSync} alt="Logo" className="logo" />
        <h2>Editar Perfil</h2>
      </div>

      <div className="profile-info">
        <div className="field">
          <label>Correo electrónico:</label>
          {editableField === 'email' ? (
            <input
              type="email"
              value={userData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          ) : (
            <span>{userData.email}</span>
          )}
          <Pencil size={16} onClick={() => handleEditClick('email')} />
          {editableField === 'email' && (
            <button onClick={() => handleSaveClick('email')}>Guardar</button>
          )}
        </div>

        <div className="field">
          <label>Nombre de usuario:</label>
          {editableField === 'username' ? (
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          ) : (
            <span>{userData.username}</span>
          )}
          <Pencil size={16} onClick={() => handleEditClick('username')} />
          {editableField === 'username' && (
            <button onClick={() => handleSaveClick('username')}>Guardar</button>
          )}
          {errorMessage && <p className="error">{errorMessage}</p>}
        </div>

        <div className="field">
          <label>Peso actual:</label>
          {editableField === 'current_weight' ? (
            <input
              type="number"
              value={userData.current_weight}
              onChange={(e) => handleChange('current_weight', e.target.value)}
            />
          ) : (
            <span>{userData.current_weight} kg</span>
          )}
          <Pencil size={16} onClick={() => handleEditClick('current_weight')} />
          {editableField === 'current_weight' && (
            <button onClick={() => handleSaveClick('current_weight')}>Guardar</button>
          )}
        </div>

        <div className="field">
          <label>Altura actual:</label>
          {editableField === 'current_height' ? (
            <input
              type="number"
              value={userData.current_height}
              onChange={(e) => handleChange('current_height', e.target.value)}
            />
          ) : (
            <span>{userData.current_height} cm</span>
          )}
          <Pencil size={16} onClick={() => handleEditClick('current_height')} />
          {editableField === 'current_height' && (
            <button onClick={() => handleSaveClick('current_height')}>Guardar</button>
          )}
        </div>

        <div className="field">
          <label>Fecha de nacimiento:</label>
          {editableField === 'birthday' ? (
            <input
              type="date"
              value={userData.birthday}
              onChange={(e) => handleChange('birthday', e.target.value)}
            />
          ) : (
            <span>{userData.birthday}</span>
          )}
          <Pencil size={16} onClick={() => handleEditClick('birthday')} />
          {editableField === 'birthday' && (
            <button onClick={() => handleSaveClick('birthday')}>Guardar</button>
          )}
        </div>

        <div className="field">
          <label>Género:</label>
          {editableField === 'gender' ? (
            <select
              value={userData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
            >
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          ) : (
            <span>{userData.gender}</span>
          )}
          <Pencil size={16} onClick={() => handleEditClick('gender')} />
          {editableField === 'gender' && (
            <button onClick={() => handleSaveClick('gender')}>Guardar</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
