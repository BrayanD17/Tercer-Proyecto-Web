import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../../styles/ImportDataForm.css';

const ImportDataForm = ({ onCancel }) => {
  const [tipoDato, setTipoDato] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const archivoInputRef = useRef(null); // Referencia al input de archivo

  const tiposDatos = [
    { value: 'pesos', label: 'Importar pesos (fecha, peso)' },
    { value: 'alturas', label: 'Importar alturas (fecha, altura)' },
    { value: 'composicion_corporal', label: 'Importar composición corporal (fecha, grasa, músculo, agua)' },
    { value: 'porcentaje_grasa', label: 'Importar porcentaje de grasa corporal (fecha, porcentajeGrasa)' },
    { value: 'vasos_de_agua', label: 'Importar cantidad de vasos de agua (fecha, vasosDeAgua)' },
    { value: 'pasos_diarios', label: 'Importar pasos diarios (fecha, cantidadPasos)' },
    { value: 'ejercicios', label: 'Importar ejercicios realizados (fecha, nombreEjercicio, duración)' },
  ];

  const handleFileChange = (event) => {
    setArchivo(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!tipoDato || !archivo) {
      setMensaje('Por favor, selecciona un tipo de dato y un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('tipo_dato', tipoDato);
    formData.append('archivo', archivo);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setMensaje('No se encontró un token de autorización. Inicia sesión de nuevo.');
        return;
      }

      const response = await axios.post('http://localhost:8000/importar_sensores/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,  // Añade el token al encabezado de autorización
        },
      });

      setMensaje(response.data.mensaje);
      setTipoDato('');
      setArchivo(null);

      // Resetear el valor del input de archivo
      if (archivoInputRef.current) {
        archivoInputRef.current.value = null;
      }
    } catch (error) {
      setMensaje(`Error al importar datos: ${error.response ? error.response.data.detail : error.message}`);
    }
  };

  return (
    <div className="modal-background"> {/* Fondo oscuro */}
      <div className="modal-content">
        <h2>Importar Datos de Sensores</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="tipoDato">Selecciona el tipo de dato:</label>
            <select
              id="tipoDato"
              value={tipoDato}
              onChange={(e) => setTipoDato(e.target.value)}
            >
              <option value="">-- Selecciona un tipo --</option>
              {tiposDatos.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="archivo">Selecciona un archivo CSV:</label>
            <input
              type="file"
              id="archivo"
              accept=".csv"
              onChange={handleFileChange}
              ref={archivoInputRef}  // Asigna la referencia al input de archivo
            />
          </div>
          <div className="button-group">
            <button type="submit" className="button add">Importar</button>
            <button type="button" className="button cancel" onClick={onCancel}>Cancelar</button>
          </div>
        </form>
        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
};

export default ImportDataForm;
