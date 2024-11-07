import React from "react";
import Chart from 'react-apexcharts';

const IMCChart = ({ peso, altura }) => {
    const imc = (peso / (altura * altura)).toFixed(1); // Calcula el IMC y lo redondea a un decimal

    //Rangos y colores del IMC
    const ranges = [
        { label: 'Bajo peso', min: 0, max: 18.4, color: '#ADD8E6' },
        { label: 'Peso normal', min: 18.5, max: 24.9, color: '#90EE90' },
        { label: 'Sobrepeso', min: 25, max: 29.9, color: '#FFFF99' },
        { label: 'Obesidad', min: 30, max: 34.9, color: '#FFA07A' },
        { label: 'Obesidad mórbida', min: 35, max: 100, color: '#FF6347' }
    ];

    // Rango actual del IMC
    const currentRange = ranges.find(range => imc >= range.min && imc <= range.max);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Chart
                options={{
                    chart: { type: 'radialBar' },
                    plotOptions: {
                        radialBar: {
                            startAngle: -90,
                            endAngle: 90,
                            track: { background: '#e7e7e7', strokeWidth: '97%', margin: 5 },
                            dataLabels: {
                                name: { show: true, fontSize: '16px', color: '#333', offsetY: -10 },
                                value: { formatter: () => `${imc} IMC`, fontSize: '20px', color: '#333', offsetY: 10 }
                            }
                        }
                    },
                    fill: {
                        colors: [currentRange ? currentRange.color : '#d3d3d3']
                    },
                    labels: [currentRange ? currentRange.label : 'IMC']
                }}
                series={[Math.min(imc, 100)]}
                type="radialBar"
                height="100%"
                width="100%"
            />
        </div>
    );
};

export default IMCChart;
