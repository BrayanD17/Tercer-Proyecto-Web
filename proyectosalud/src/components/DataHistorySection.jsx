import React, { useState } from "react";
import "../styles/DataHistorySection.css";
import ChartHistorical from "./graphics/ChartHistorical";

const DataHistory = () => {
    const [periodo, setPeriodo] = useState('1 semana');
    const [tipoGrafico, setTipoGrafico] = useState('peso');

    const historicalDataStatic = {
        peso: [
          { date: "2024-10-01", value: 70 },
          { date: "2024-10-02", value: 71 },
          { date: "2024-10-03", value: 70.5 },
          { date: "2024-10-04", value: 71.2 },
          { date: "2024-10-05", value: 70.8 },
          { date: "2024-10-06", value: 70 },
          { date: "2024-09-05", value: 69.5 },
          { date: "2024-09-14", value: 67 },
          { date: "2024-09-12", value: 68 },
          { date: "2024-09-10", value: 69 },
          { date: "2024-09-08", value: 55 },
          { date: "2024-07-05", value: 56},
          { date: "2024-07-02", value: 57 },
          { date: "2024-07-03", value: 58},
          { date: "2024-07-01", value: 57 },
          { date: "2024-07-03", value: 58},
          { date: "2024-07-01", value: 57 },
          { date: "2024-07-03", value: 58},
          { date: "2024-07-01", value: 57 },
        ],
        musculo: [
          { date: "2024-10-01", value: 25 },
          { date: "2024-10-02", value: 25.5 },
          { date: "2024-10-03", value: 26 },
          { date: "2024-10-04", value: 26.5 },
          { date: "2024-10-05", value: 27 },
          { date: "2024-10-06", value: 27.5 },
          { date: "2024-10-07", value: 28 },
        ],
        grasa: [
          { date: "2024-10-01", value: 20 },
          { date: "2024-10-02", value: 19.5 },
          { date: "2024-10-03", value: 19 },
          { date: "2024-10-04", value: 18.8 },
          { date: "2024-10-05", value: 18.5 },
          { date: "2024-10-06", value: 18.2 },
          { date: "2024-10-07", value: 18 },
        ],
        agua: [
          { date: "2024-10-01", value: 2 },
          { date: "2024-10-02", value: 2.5 },
          { date: "2024-10-03", value: 3 },
          { date: "2024-10-04", value: 2.8 },
          { date: "2024-10-05", value: 3.1 },
          { date: "2024-10-06", value: 2.9 },
          { date: "2024-10-07", value: 3 },
        ],
        pasos: [
          { date: "2024-10-01", value: 8000 },
          { date: "2024-10-02", value: 12000 },
          { date: "2024-10-03", value: 10000 },
          { date: "2024-10-04", value: 7000 },
          { date: "2024-10-05", value: 9500 },
          { date: "2024-10-06", value: 11000 },
          { date: "2024-10-07", value: 9000 },
        ],
        ejercicio: [
          { date: "2024-10-01", value: 30 },
          { date: "2024-10-02", value: 45 },
          { date: "2024-10-03", value: 60 },
          { date: "2024-10-04", value: 50 },
          { date: "2024-10-05", value: 40 },
          { date: "2024-10-06", value: 70 },
          { date: "2024-10-07", value: 55 },
        ]
    };

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
                 {/*Verificar cual tipo de grafico es mejor usar (se debe modificar y ver como se van a mostrar el historico de agua y ejercicios)*/}
                {historicalDataStatic[tipoGrafico] && (
                    <ChartHistorical 
                        data={historicalDataStatic[tipoGrafico]} 
                        tipo={tipoGrafico === "peso" ? "line" : tipoGrafico === "musculo" ? "area" :tipoGrafico === "grasa" ? "line": "bar"}
                        title={`Gráfico de ${tipoGrafico} durante ${periodo}`} 
                    />
                )}
            </div>
        </div>
    );
};

export default DataHistory;
