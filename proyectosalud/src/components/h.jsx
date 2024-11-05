import React from 'react';
import Chart from 'react-apexcharts';

// Reusable Scorecard component
const Scorecard = ({ title, value }) => {
    return (
        <div className="scorecard">
            <h3>{title}</h3>
            <Chart
                options={{
                    chart: {
                        type: 'radialBar',
                    },
                    plotOptions: {
                        radialBar: {
                            dataLabels: {
                                name: {
                                    fontSize: '16px',
                                },
                                value: {
                                    fontSize: '20px',
                                },
                            },
                        },
                    },
                    labels: [title],
                }}
                series={[value]}
                type="radialBar"
                height={200}
            />
        </div>
    );
};

// Gauge Chart Component
const GaugeChart = ({ title, value }) => {
    return (
        <div className="gauge-chart">
            <h3>{title}</h3>
            <Chart
                options={{
                    chart: {
                        type: 'radialBar',
                    },
                    plotOptions: {
                        radialBar: {
                            startAngle: -90,
                            endAngle: 90,
                            dataLabels: {
                                name: {
                                    show: true,
                                    fontSize: '16px',
                                },
                                value: {
                                    show: true,
                                    fontSize: '20px',
                                },
                            },
                        },
                    },
                    labels: [title],
                }}
                series={[value]}
                type="radialBar"
                height={200}
            />
        </div>
    );
};

// Bar Chart Component
const BarChart = ({ title, data, categories }) => {
    return (
        <div className="bar-chart">
            <h3>{title}</h3>
            <Chart
                options={{
                    chart: {
                        type: 'bar',
                    },
                    xaxis: {
                        categories: categories,
                    },
                }}
                series={[{
                    name: title,
                    data: data,
                }]}
                type="bar"
                height={200}
            />
        </div>
    );
};

// Line Chart Component
const LineChart = ({ title, data, categories }) => {
    return (
        <div className="line-chart">
            <h3>{title}</h3>
            <Chart
                options={{
                    chart: {
                        type: 'line',
                    },
                    xaxis: {
                        categories: categories,
                    },
                }}
                series={[{
                    name: title,
                    data: data,
                }]}
                type="line"
                height={200}
            />
        </div>
    );
};

// Glass Chart Component
const GlassChart = ({ title, value, max }) => {
    const valueInMl = value * 250; // Conversion from glasses to milliliters

    return (
        <div className="glass-chart">
            <h3>{title} ({valueInMl} ml)</h3>
            <Chart
                options={{
                    chart: {
                        type: 'bar',
                        stacked: true,
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '40%',
                            endingShape: 'rounded',
                        },
                    },
                    xaxis: {
                        categories: ['Vasos'],
                    },
                    yaxis: {
                        max: max * 250, // Adjust the max to be in milliliters
                    },
                    fill: {
                        colors: ['#00BFFF'],
                    },
                }}
                series={[{
                    name: 'Cantidad de vasos',
                    data: [valueInMl],
                }]}
                type="bar"
                height={300}
            />
        </div>
    );
};

const StepsChart = ({ title, currentSteps, goalSteps }) => {
    const percentage = (currentSteps / goalSteps) * 100;

    return (
        <div className="steps-chart">
            <h3>{title}</h3>
            <Chart
                options={{
                    chart: {
                        type: 'radialBar',
                    },
                    plotOptions: {
                        radialBar: {
                            hollow: {
                                size: '70%',
                            },
                            dataLabels: {
                                name: {
                                    show: true,
                                    fontSize: '16px',
                                    offsetY: -10,
                                },
                                value: {
                                    show: true,
                                    fontSize: '20px',
                                    formatter: function () {
                                        return `${currentSteps} / ${goalSteps}`;
                                    },
                                },
                            },
                        },
                    },
                    labels: ['Pasos'],
                    colors: ['#28a745'],
                }}
                series={[percentage]}
                type="radialBar"
                height={300}
            />
        </div>
    );
};

import React from "react";
import Chart from 'react-apexcharts';

const ChartHistorical = ({ data, tipo, title }) => {
    // Configuración base del gráfico
    const chartOptions = {
        chart: {
            type: tipo,
        },
        xaxis: tipo === 'bar' || tipo === 'line' || tipo === 'area' ? {
            categories: data.map(item => item.date), // Solo para gráficos con eje X
        } : undefined,
        labels: tipo === 'pie' || tipo === 'donut' || tipo === 'radialBar' ? data.map(item => item.date) : [],
        title: {
            text: title,
            align: 'left',
        },
        plotOptions: {
            radialBar: {
                dataLabels: {
                    name: {
                        show: true,
                    },
                    value: {
                        show: true,
                    },
                },
            },
        },
    };

    // Configuración de los datos (series)
    const seriesData = tipo === 'pie' || tipo === 'donut' || tipo === 'radialBar'
        ? data.map(item => item.value) // Array plano de valores
        : [{ name: title, data: data.map(item => item.value) }]; // Series con eje X

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


