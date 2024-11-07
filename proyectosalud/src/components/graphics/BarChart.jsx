import React from "react";
import Chart from 'react-apexcharts';

const BarChart = ({ title, data, categories }) => {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <h5>{title}</h5>
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
                    name: title, //Leyenda
                    data: data,
                }]}
                type="bar"
                height="100%"
                width="100%"
            />
        </div>
    );
};

export default BarChart;