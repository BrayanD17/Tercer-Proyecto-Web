import React, { useState, useContext, useEffect } from 'react';
import '../../styles/EditProfile.css';
import { AuthContext } from '../../context/AuthContext';
import { Pencil } from 'lucide-react';
import LogoHealthSync from '../../images/logoHealthSync.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProfile = ({ username, onLogout, onEditComplete }) => {
  const { getUserProfile, updateUserField, getUsernames, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [editableField, setEditableField] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [usernames, setUsernames] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserProfile(username);
      setUserData(data);
    };
    const fetchUsernames = async () => {
      const usernamesList = await getUsernames();
      setUsernames(usernamesList);
    };
    fetchUserData();
    fetchUsernames();
  }, [getUserProfile, getUsernames, username]);

  const handleEditClick = (field) => {
    if (editableField === field) {
      setEditableField(null);
      setErrorMessage('');
    } else {
      setEditableField(field);
      setErrorMessage('');
    }
  };

  const handleSaveClick = async (field) => {
    let updatedValue = userData[field];
    
    if (field === 'username' && newUsername !== userData.username) {
      if (usernames.includes(newUsername)) {
        setErrorMessage('El nombre de usuario ya está en uso');
        return;
      }
      updatedValue = newUsername;
    }
  
    if (field === 'birthday') {
      updatedValue = `${userData.birthday} 00:00:00`;
    }
  
    const success = await updateUserField(username, field, updatedValue);
  
    if (success) {
      toast.success(`${field} actualizado exitosamente`);
      if (field === 'username') {
        await logout();
        onLogout(); 
      } else {
        setEditableField(null);
        onEditComplete();
      }
    } else {
      toast.error(`Error al actualizar ${field}`);
    }
  };
    
  const handleChange = (field, value) => {
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrorMessage('Ingrese un correo electrónico válido');
        return;
      }
    }
    if ((field === 'current_weight' || field === 'current_height') && value <= 0) {
      toast.error(`${field === 'current_weight' ? 'Peso' : 'Altura'} debe ser un valor positivo.`);
      return;
    }
    setErrorMessage('');
    setUserData((prevData) => ({ ...prevData, [field]: value }));
  };

  if (!userData) return <p>Cargando datos...</p>;

  return (
    <div className="edit-profile">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
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
          {errorMessage && <p className="error">{errorMessage}</p>}
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
              step="0.1"
              value={userData.current_weight}
              onChange={(e) => handleChange('current_weight', parseFloat(e.target.value))}
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
              step="0.1"
              value={userData.current_height}
              onChange={(e) => handleChange('current_height', parseFloat(e.target.value))}
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
              type="datetime-local"
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
