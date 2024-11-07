import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (storedToken) {
      setToken(storedToken);
      setUsername(storedUsername);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setToken(data.access_token);
        setUsername(username);
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", username);
        return true;
      } else {
        throw new Error(data.detail);
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
      console.log(data); 
  
      return response.ok;
    } catch (error) {
      console.error("Error en el registro:", error);
      return false;
    }
  };

  const getUsernames = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/users/");
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("Error al obtener nombres de usuario");
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const getUserProfile = async (username) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/user/${username}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("Error al obtener el perfil del usuario");
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const updateUserProfile = async (username, updatedData) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/user/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        return true;
      } else {
        throw new Error("Error al actualizar el perfil del usuario");
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const changePassword = async (username, currentPassword, newPassword) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/user/${username}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      if (response.ok) {
        return true;
      } else {
        throw new Error("Error al cambiar la contraseña");
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      username,
      login, 
      register, 
      getUsernames, 
      getUserProfile, 
      updateUserProfile, 
      changePassword, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
