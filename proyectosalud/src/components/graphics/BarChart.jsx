import React from "react";
import Chart from 'react-apexcharts';

const BarChart = ({ title, data, categories }) => {
    const getUnit = (category) => {
        if (category === 'Sin datos') {
            return ''; 
        }
        return category === 'Agua' ? 'L' : 'kg';
    };
    

    const categoriesWithUnits = categories.map((category) => `${category} ${getUnit(category)}`);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <h5>{title}</h5>
            <Chart
                options={{
                    chart: {
                        type: 'bar',
                    },
                    xaxis: {
                        categories: categoriesWithUnits,
                    },
                }}
                series={[{
                    name: title, // Leyenda
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
