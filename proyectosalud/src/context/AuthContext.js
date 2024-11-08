import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [dashboardData,setDashboardData]=useState(null);

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
        localStorage.setItem("user_id", data.user_id); 
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

  const updateUserField = async (username, field, value) => {
    try {
      // Si el campo es "birthday", formateamos la fecha con hora incluida
      if (field === "birthday" && value) {
        const date = new Date(value);
        // Convertir a "YYYY-MM-DDT00:00:00" formato ISO
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        value = `${year}-${month}-${day}T00:00:00`;
      }
  
      const response = await fetch(`http://127.0.0.1:8000/user/${username}/update-field`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });
      const data = await response.json();
      if (response.ok) {
        if (field === "username") {
          setUsername(value);
          localStorage.setItem("username", value);
          
        }
        return true;
      } else {
        throw new Error(data.detail || "Error al actualizar el campo");
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };    

  const changePassword = async (username, currentPassword, newPassword) => {
    console.log("Llamando al endpoint para cambiar contraseña con:", { username, currentPassword, newPassword });
    try {
        const response = await fetch("http://127.0.0.1:8000/user/change-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ username, current_password: currentPassword, new_password: newPassword }),
        });
        if (response.ok) {
            console.log("Respuesta del servidor:", await response.json());
            return true;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Error al cambiar la contraseña");
        }
    } catch (error) {
        console.error("Error en changePassword:", error);
        return false;
    }
  };

  const logoutUser = async () => {
    try {
      await fetch("http://127.0.0.1:8000/logout/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error en el cierre de sesión:", error);
    } finally {
      setToken(null);
      setUsername(null);
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    }
  };

  const getDataDashboardOverview = async()=>{
    if(!token){
      console.error("Token no disponible");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/dashboard_overview/",{
        method:"GET",
        headers:{
           Authorization: `Bearer ${token}`,
        }
      });

      if(response.ok){
        const data = await response.json();
        console.log("Datos obtenidos del servidor:", data);  // Agrega este log
        setDashboardData(data);
      }else{
        throw new Error("Error al obtener los datos los datos del usuario para mostrarlos en el dashboard")
      }
    } catch (error) {
      console.error("Error al obtener los datos desde el server", error)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      token, 
      username,
      dashboardData,
      login, 
      register, 
      getUsernames, 
      getUserProfile,  
      updateUserField,
      changePassword, 
      logout :logoutUser,
      getDataDashboardOverview,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
