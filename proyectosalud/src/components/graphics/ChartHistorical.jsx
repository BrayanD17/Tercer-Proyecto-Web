import React from "react";
import Chart from 'react-apexcharts';

const ChartHistorical = ({ data, tipo, title }) => {
    // Configuración de la serie de datos
    const seriesData = Array.isArray(data[0]?.value)
        ? data.map(item => ({
            name: item.name,
            data: item.value.map((val, index) => ({ x: item.dates[index], y: val }))
        }))
        : [{
            name: title,
            data: data.map(item => ({ x: item.date, y: item.value }))
        }];

    const chartOptions = {
        chart: {
            type: tipo,
            height: 350,
            zoom: {
                enabled: true,
            }
        },
        markers: {
            size: 5,
            hover: {
                sizeOffset: 3
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#333'],
            },
        },
        xaxis: {
            type: 'category', // Cambia 'datetime' por 'category'
            categories: data.map(item => item.date), // Muestra solo las fechas con datos
            title: {
                text: 'Fecha',
            }
        },
        yaxis: {
            title: {
                text: 'Valor',
            }
        },
        title: {
            text: title,
            align: 'left',
        },
        tooltip: { //Para más de una serie
            shared: true,
            intersect: false,
        }
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Chart
                options={chartOptions}
                series={seriesData}
                type={tipo}
                height="100%"
                width="100%"
            />
        </div>
    );
};

export default ChartHistorical;
