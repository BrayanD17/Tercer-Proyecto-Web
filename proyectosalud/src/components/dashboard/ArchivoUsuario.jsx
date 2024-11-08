import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import { obtenerArchivoUsuario } from "./api"; // Función para obtener el archivo desde el servidor.

const ArchivoUsuario = () => {
  const { token } = useContext(AuthContext);
  const [archivo, setArchivo] = useState(null);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchArchivo = async () => {
      try {
        const archivoData = await obtenerArchivoUsuario(token); 
        if (archivoData.userId === userId) {
          setArchivo(archivoData);
        } else {
          console.warn("Archivo no corresponde al usuario actual");
        }
      } catch (error) {
        console.error("Error al obtener el archivo:", error);
      }
    };

    fetchArchivo();
  }, [token, userId]);

  return (
    <div>
      {archivo ? (
        <div>
          <h2>Archivo del Usuario</h2>
          <p>{archivo.contenido}</p>
        </div>
      ) : (
        <p>No se encontró archivo para el usuario actual.</p>
      )}
    </div>
  );
};

export default ArchivoUsuario;
