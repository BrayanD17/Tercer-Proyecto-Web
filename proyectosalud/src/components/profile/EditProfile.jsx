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
  const [errorMessages, setErrorMessages] = useState({});
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
      setErrorMessages({});
    } else {
      setEditableField(field);
      setErrorMessages({});
    }
  };

  const handleSaveClick = async (field) => {
    if (!userData[field] || userData[field] === '') {
      setErrorMessages((prev) => ({ ...prev, [field]: 'Este campo no puede estar vacío' }));
      return;
    }
  
    let updatedValue = userData[field];
  
    // Formatear la fecha en "YYYY-MM-DDTHH:MM:SS" para el backend
    if (field === 'birthday') {
      const date = new Date(updatedValue);
      updatedValue = date.toISOString().split('T')[0] + "T00:00:00"; // Formato ISO sin desfase de días
    }
  
    // Validación para el nombre de usuario
    if (field === 'username' && newUsername !== userData.username) {
      if (usernames.includes(newUsername)) {
        setErrorMessages((prev) => ({ ...prev, username: 'El nombre de usuario ya está en uso' }));
        return;
      }
      updatedValue = newUsername;
    }
  
    const success = await updateUserField(username, field, updatedValue);
  
    if (success) {
      toast.success(`${field} actualizado exitosamente`, { autoClose: 2000 });
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
    if (field === 'current_weight' || field === 'current_height') {
      if (value < 0) {
        setErrorMessages((prev) => ({ ...prev, [field]: 'El valor debe ser positivo' }));
        return;
      } else {
        setErrorMessages((prev) => ({ ...prev, [field]: '' }));
      }
    }
  
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value) && value !== '') {
        setErrorMessages((prev) => ({ ...prev, email: 'Ingrese un correo electrónico válido' }));
        return;
      } else {
        setErrorMessages((prev) => ({ ...prev, email: '' }));
      }
    }
  
    setErrorMessages((prev) => ({ ...prev, [field]: '' }));
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
          <label>Correo:</label>
          {editableField === 'email' ? (
            <input
              type="email"
              value={userData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          ) : (
            <span>{userData.email}</span>
          )}
          <Pencil size={16} onClick={() => handleEditClick('email')} />
          {editableField === 'email' && (
            <button onClick={() => handleSaveClick('email')}>Guardar</button>
          )}
          {errorMessages.email && <p className="error">{errorMessages.email}</p>}
        </div>
  
        <div className="field">
          <label>Usuario:</label>
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
          {errorMessages.username && <p className="error">{errorMessages.username}</p>}
        </div>
  
        <div className="field">
          <label>Peso actual:</label>
          {editableField === 'current_weight' ? (
            <input
              type="number"
              step="0.1"
              value={userData.current_weight || ''}
              onChange={(e) => handleChange('current_weight', parseFloat(e.target.value))}
            />
          ) : (
            <span>{userData.current_weight} kg</span>
          )}
          <Pencil size={16} onClick={() => handleEditClick('current_weight')} />
          {editableField === 'current_weight' && (
            <button onClick={() => handleSaveClick('current_weight')}>Guardar</button>
          )}
          {errorMessages.current_weight && <p className="error">{errorMessages.current_weight}</p>}
        </div>
  
        <div className="field">
          <label>Altura actual:</label>
          {editableField === 'current_height' ? (
            <input
              type="number"
              step="0.1"
              value={userData.current_height || ''}
              onChange={(e) => handleChange('current_height', parseFloat(e.target.value))}
            />
          ) : (
            <span>{userData.current_height} cm</span>
          )}
          <Pencil size={16} onClick={() => handleEditClick('current_height')} />
          {editableField === 'current_height' && (
            <button onClick={() => handleSaveClick('current_height')}>Guardar</button>
          )}
          {errorMessages.current_height && <p className="error">{errorMessages.current_height}</p>}
        </div>
  
        <div className="field">
          <label>Fecha:</label>
          {editableField === 'birthday' ? (
            <input
              type="date"
              value={userData.birthday ? userData.birthday.split('T')[0] : ''} // Mostrar solo la parte de la fecha en el input
              onChange={(e) => handleChange('birthday', e.target.value)}
            />
          ) : (
            <span>{userData.birthday ? userData.birthday.split('T')[0] : ''}</span> // Mostrar solo la fecha en formato YYYY-MM-DD
          )}
          <Pencil size={16} onClick={() => handleEditClick('birthday')} />
          {editableField === 'birthday' && (
            <button onClick={() => handleSaveClick('birthday')}>Guardar</button>
          )}
          {errorMessages.birthday && <p className="error">{errorMessages.birthday}</p>}
        </div>
  
        <div className="field">
          <label>Género:</label>
          {editableField === 'gender' ? (
            <select
              value={userData.gender || ''}
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
          {errorMessages.gender && <p className="error">{errorMessages.gender}</p>}
        </div>
      </div>
    </div>
  );  
};

export default EditProfile;
