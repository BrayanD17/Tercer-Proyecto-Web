import React from "react";
import Chart from 'react-apexcharts';

const StepsChart = ({currentSteps, goalSteps }) => {
    const percentage = (currentSteps / goalSteps) * 100;

    return (
        <div style={{ width: '100%', height: '100%' }}>
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
                                value: {
                                    show: true,
                                    fontSize: '15px',
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
                height="100%"
                width="100%"
            />
        </div>
    );
};

export default StepsChart;