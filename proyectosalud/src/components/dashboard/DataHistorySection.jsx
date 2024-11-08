import React, { useState, useEffect, useContext } from "react";
import "../../styles/DataHistorySection.css";
import ChartHistorical from "../graphics/ChartHistorical";
import { AuthContext } from '../../context/AuthContext';

const DataHistory = () => {
    const { token } = useContext(AuthContext);
    const [periodo, setPeriodo] = useState('');
    const [tipoGrafico, setTipoGrafico] = useState('');
    const [historicalData, setHistoricalData] = useState(null);

    const fetchHistoricalData = async () => {
        if (tipoGrafico && periodo) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/historico_datos/?tipo_dato=${tipoGrafico}&periodo=${periodo}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error("Error al obtener datos históricos");

                const data = await response.json();
                setHistoricalData(data.data); // Se asume que `data.data` es el array de datos
            } catch (error) {
                console.error("Error al obtener datos históricos:", error);
            }
        }
    };

    useEffect(() => {
        fetchHistoricalData();
    }, [tipoGrafico, periodo]);

    const handleTipoGraficoChange = (e) => {
        setTipoGrafico(e.target.value);
    };

    return (
        <div className="principal-history-section">
            <h1>Histórico de datos</h1>
            <div className="select-container">
                <div className="select-period">
                    <label htmlFor="periodo">Periodo </label>
                    <select id="periodo" onChange={(e) => setPeriodo(e.target.value)} value={periodo}>
                        <option value="" disabled>Seleccione un periodo</option>
                        <option value="1 semana">1 semana</option>
                        <option value="1 mes">1 mes</option>
                        <option value="3 meses">3 meses</option>
                        <option value="6 meses">6 meses</option>
                        <option value="1 año">1 año</option>
                    </select>
                </div>
                <div className="select-graphic">
                    <label htmlFor="tipoGrafico">Histórico </label>
                    <select id="tipoGrafico" onChange={handleTipoGraficoChange} value={tipoGrafico}>
                        <option value="" disabled>Seleccione un histórico</option>
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
                {historicalData && (
                    <ChartHistorical 
                        data={historicalData.map(item => ({ date: item.date, value: item[tipoGrafico] }))}
                        tipo={tipoGrafico === "peso" ? "line" : tipoGrafico === "musculo" ? "area" : tipoGrafico === "grasa" ? "line" : "bar"}
                        title={`Gráfico de ${tipoGrafico} durante ${periodo}`} 
                    />
                )}
            </div>
        </div>
    );
};

export default DataHistory;
