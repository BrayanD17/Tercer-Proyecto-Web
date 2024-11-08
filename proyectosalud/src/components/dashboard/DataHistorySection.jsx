import React, { useState, useEffect, useContext } from "react";
import "../../styles/DataHistorySection.css";
import ChartHistorical from "../graphics/ChartHistorical";
import { AuthContext } from "../../context/AuthContext"; // Ajusta el path a donde se encuentre tu AuthContext

const DataHistorySection = () => {
    const { token } = useContext(AuthContext);  // Accede al token desde el contexto
    const [periodo, setPeriodo] = useState(''); // Opción predeterminada
    const [tipoGrafico, setTipoGrafico] = useState(''); // Opción predeterminada
    const [historicalData, setHistoricalData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleTipoGraficoChange = (e) => {
        setTipoGrafico(e.target.value);
    };

    useEffect(() => {
        const fetchHistoricalData = async () => {
            setLoading(true);
            try {
                // Asegúrate de que periodo, tipoGrafico y token estén disponibles antes de llamar al endpoint
                if (periodo && tipoGrafico && token) {
                    const response = await fetch(`http://127.0.0.1:8000/historico?tipo_dato=${tipoGrafico}&periodo=${periodo}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Datos no encontrados');
                    }

                    const data = await response.json();
                    setHistoricalData(data);
                }
            } catch (error) {
                console.error("Error al obtener datos históricos:", error);
            } finally {
                setLoading(false);
            }
        };

        // Solo ejecuta la función si ambos valores están seleccionados
        if (periodo && tipoGrafico) {
            fetchHistoricalData();
        }
    }, [periodo, tipoGrafico, token]);

    return (
        <div className="principal-history-section">
            <h1>Histórico de datos</h1>
            <div className="select-container">
                <div className="select-period">
                    <label htmlFor="periodo">Período: </label>
                    <select id="periodo" onChange={(e) => setPeriodo(e.target.value)} value={periodo}>
                        <option value="" disabled>Selecciona un período</option> 
                        <option value="1 semana">1 semana</option>
                        <option value="1 mes">1 mes</option>
                        <option value="3 meses">3 meses</option>
                        <option value="6 meses">6 meses</option>
                        <option value="1 año">1 año</option>
                    </select>
                </div>
                <div className="select-graphic">
                    <label htmlFor="tipoGrafico">Histórico: </label>
                    <select id="tipoGrafico" onChange={handleTipoGraficoChange} value={tipoGrafico}>
                        <option value="" disabled>Selecciona un histórico</option>
                        <option value="peso">Histórico de peso</option>
                        <option value="musculo">Histórico de músculo</option>
                        <option value="porcentaje_grasa">Histórico del porcentaje de grasa corporal</option>
                        <option value="vasos_agua">Histórico de agua consumida</option>
                        <option value="pasos">Histórico de total de pasos</option>
                        <option value="ejercicios">Histórico de ejercicios</option>
                    </select>
                </div>
            </div>
            <div className="historical-chart">
            {loading ? (
            <p>Cargando datos...</p>
        ) : (
            tipoGrafico && periodo && historicalData.promedio_peso ? (
                <ChartHistorical
                    data={historicalData.promedio_peso}  // Ajusta esta propiedad según la respuesta
                    tipo={tipoGrafico === "peso" || tipoGrafico === "porcentaje_grasa" ? "line" : tipoGrafico === "musculo" ? "area" : "bar"}
                    title={`Gráfico de ${tipoGrafico} durante ${periodo}`}
                />
            ) : (
                <p>Por favor, selecciona el período y el tipo de histórico para ver los datos.</p>
            )
        )}
            </div>
        </div>
    );
};

export default DataHistorySection;
