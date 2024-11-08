import React, { useState, useEffect, useContext } from "react";
import "../../styles/DataHistorySection.css";
import ChartPeso from "../graphics/ChartPeso";
import ChartMusculo from "../graphics/ChartMusculo";
import ChartGrasa from "../graphics/ChartGrasa";
import ChartAgua from "../graphics/ChartAgua";
import ChartPasos from "../graphics/ChartPasos";
import ChartEjercicio from "../graphics/ChartEjercicio";
import { AuthContext } from "../../context/AuthContext";

const DataHistory = () => {
    const { token } = useContext(AuthContext);
    const [periodo, setPeriodo] = useState('1 semana');
    const [tipoGrafico, setTipoGrafico] = useState('peso');
    const [historicalData, setHistoricalData] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Para manejar el estado de carga

    // Función para obtener los datos del backend
    const fetchData = async () => {
        setIsLoading(true); // Empieza el loading
        try {
            const response = await fetch(`http://127.0.0.1:8000/historico?tipo_dato=${tipoGrafico}&periodo=${periodo}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            console.log("Datos obtenidos del servidor:", data);

            // Asumiendo que data.data contiene el array de 61 datos, formatea los datos para el gráfico
            const formattedData = data.data.map(item => ({
                date: item.date,
                value: item.value
            }));

            setHistoricalData(formattedData); // Actualiza el estado con los datos formateados
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        } finally {
            setIsLoading(false); // Termina el loading
        }
    };

    // Llamar a la función fetchData cuando el componente se monta o cuando el tipo de gráfico o período cambian
    useEffect(() => {
        fetchData();
    }, [periodo, tipoGrafico]);

    const handleTipoGraficoChange = (e) => {
        setTipoGrafico(e.target.value);
    };

    return (
        <div className="principal-history-section">
            <h1>Histórico de datos</h1>
            <div className="select-container">
                <div className="select-period">
                    <label htmlFor="periodo">Selecciona el período: </label>
                    <select id="periodo" onChange={(e) => setPeriodo(e.target.value)} value={periodo}>
                        <option value="1 semana">1 semana</option>
                        <option value="1 mes">1 mes</option>
                        <option value="3 meses">3 meses</option>
                        <option value="6 meses">6 meses</option>
                        <option value="1 año">1 año</option>
                    </select>
                </div>
                <div className="select-graphic">
                    <label htmlFor="tipoGrafico">Selecciona el histórico: </label>
                    <select id="tipoGrafico" onChange={handleTipoGraficoChange} value={tipoGrafico}>
                        <option value="peso">Histórico de peso</option>
                        <option value="musculo">Histórico de músculo</option>
                        <option value="grasa">Histórico del porcentaje de grasa corporal</option>
                        <option value="agua">Histórico de agua consumida</option>
                        <option value="pasos">Histórico de total de pasos</option>
                        <option value="ejercicio">Histórico de ejercicios</option>
                    </select>
                </div>
            </div>

            <div className="historical-chart">
                {/* Mostrar mensaje si no hay datos */}
                {isLoading ? (
                    <p>Cargando datos...</p>
                ) : historicalData.length === 0 ? (
                    <p>No hay datos disponibles para el período y tipo de gráfico seleccionados.</p>
                ) : (
                    <>
                        {tipoGrafico === "peso" && <ChartPeso data={historicalData} title={`Gráfico de ${tipoGrafico} durante ${periodo}`} />}
                        {tipoGrafico === "musculo" && <ChartMusculo data={historicalData} title={`Gráfico de ${tipoGrafico} durante ${periodo}`} />}
                        {tipoGrafico === "grasa" && <ChartGrasa data={historicalData} title={`Gráfico de ${tipoGrafico} durante ${periodo}`} />}
                        {tipoGrafico === "agua" && <ChartAgua data={historicalData} title={`Gráfico de ${tipoGrafico} durante ${periodo}`} />}
                        {tipoGrafico === "pasos" && <ChartPasos data={historicalData} title={`Gráfico de ${tipoGrafico} durante ${periodo}`} />}
                        {tipoGrafico === "ejercicio" && <ChartEjercicio data={historicalData} title={`Gráfico de ${tipoGrafico} durante ${periodo}`} />}
                    </>
                )}
            </div>
        </div>
    );
};

export default DataHistory;
