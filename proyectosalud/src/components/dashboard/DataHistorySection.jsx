import React, { useState, useEffect } from "react";
import "../../styles/DataHistorySection.css";
import ChartHistorical from "../graphics/ChartHistorical";

const DataHistory = () => {
    const [periodo, setPeriodo] = useState('1 semana');
    const [tipoGrafico, setTipoGrafico] = useState('peso');
    const [historicalData, setHistoricalData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleTipoGraficoChange = (e) => {
        setTipoGrafico(e.target.value);
    };

    const fetchHistoricalData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/historico_datos/?tipo_dato=${tipoGrafico}&periodo_tiempo=${periodo}`);
            if (!response.ok) throw new Error("Error al obtener los datos");
            
            const data = await response.json();
            const formattedData = Object.entries(data).map(([key, value]) => ({
                date: key,
                value: value
            }));
            
            setHistoricalData(formattedData);
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistoricalData();
    }, [tipoGrafico, periodo]);

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
                        <option value="pesos">Histórico del peso</option>
                        <option value="musculo">Histórico del músculo</option>
                        <option value="porcentaje_grasa">Histórico del porcentaje de grasa corporal</option>
                        <option value="vasos_de_agua">Histórico de la cantidad total de vasos de agua y litros totales</option>
                        <option value="pasos_diarios">Histórico de la cantidad total de pasos dados</option>
                        <option value="ejercicios">Histórico de la cantidad total y duración total de ejercicios</option>
                    </select>

                </div>
            </div>
            <div className="historical-chart">
                {loading ? (
                    <p>Cargando datos...</p>
                ) : (
                    historicalData.length > 0 && (
                        <ChartHistorical 
                            data={historicalData} 
                            tipo={tipoGrafico === "peso" ? "line" : tipoGrafico === "musculo" ? "area" : tipoGrafico === "grasa" ? "line" : "bar"}
                            title={`Gráfico de ${tipoGrafico} durante ${periodo}`} 
                        />
                    )
                )}
            </div>
        </div>
    );
};

export default DataHistory;
