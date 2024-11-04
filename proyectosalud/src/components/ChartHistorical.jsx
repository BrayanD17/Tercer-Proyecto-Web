// ChartHistorical.jsx
import React from "react";
import Chart from 'react-apexcharts';

const ChartHistorical = ({ data, tipo, title }) => {
    const chartOptions = {
        chart: {
            type: tipo,
        },
        xaxis: {
            categories: data.map(item => item.date), // Suponiendo que los datos tienen la estructura [{ date, value }]
        },
        title: {
            text: title,
            align: 'left',
        },
    };

    const seriesData = [{
        name: title,
        data: data.map(item => item.value), // Extraer solo los valores para la serie
    }];

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Chart
                options={chartOptions}
                series={seriesData}
                type={tipo} // Usa el tipo que se pasa como propiedad
                height="100%"
                width="100%"
            />
        </div>
    );
};

export default ChartHistorical;
