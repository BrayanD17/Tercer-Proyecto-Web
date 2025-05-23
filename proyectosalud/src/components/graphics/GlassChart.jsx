import React from "react";
import Chart from 'react-apexcharts';

const GlassChart = ({ value, max }) => {
    const valueInMl = value * 250;

    return (
        <div style={{ width: '100%', height: '100%' }}>
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
                    dataLabels: {
                        enabled: true,
                        formatter: function (val) {
                            const valueInGlasses = val / 250; // convertir ml a vasos
                            return `${valueInGlasses.toFixed(1)} vasos (${val} ml)`; // mostrar en vasos y ml
                        },
                        style: {
                            fontSize: '14px',
                            colors: ['#333']
                        }
                    },
                    xaxis: {
                        categories: ['Vasos de agua tomados'],
                    },
                    yaxis: {
                        max: max * 250, // max a ml
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
                height="100%"
                width="100%"
            />
        </div>
    );
};

export default GlassChart;
