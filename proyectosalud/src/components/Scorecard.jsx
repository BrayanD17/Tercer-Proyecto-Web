import React from "react";
import Chart from 'react-apexcharts';

const Scorecard = ({ peso, unit = 'kg', fillColor = '#00E396', title = 'Score' }) => {
    const pesoMaximo = 300; // Define el peso máximo para el gauge
    const isPercentage = unit === '%';
    const displayValue = isPercentage ? peso : Math.min((peso / pesoMaximo) * 100, 100);
    const valueLabel = isPercentage ? `${peso}%` : `${peso} kg`;

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Chart
                options={{
                    chart: { type: 'radialBar' },
                    plotOptions: {
                        radialBar: {
                            hollow: { size: '70%' },
                            dataLabels: {
                                value: {
                                    formatter: () => valueLabel, // Muestra el valor directamente
                                    fontSize: '20px',
                                    color: '#333'
                                },
                                total: {
                                    show: true,
                                    label: title, // Muestra el título personalizado
                                    formatter: () => valueLabel // Muestra el valor total
                                }
                            }
                        }
                    },
                    fill: {
                        colors: [fillColor] // Personaliza el color de relleno
                    },
                    labels: [title] // Usa el título personalizado
                }}
                series={[displayValue]} // Usa el valor directamente
                type="radialBar"
                height="100%"
                width="100%"
            />
        </div>
    );
};

export default Scorecard;
