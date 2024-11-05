import React from "react";
import Chart from 'react-apexcharts';

const HeightChart = ({ altura, alturaMaxima = 200 }) => {
    
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Chart
                options={{
                    chart: { type: 'bar', height: 350 },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '35%',
                            endingShape: 'rounded'
                        }
                    },
                    colors: ['#FF5733'],
                    xaxis: {
                        categories: ['Altura']
                    },
                    yaxis: {
                        max: alturaMaxima,
                        title: {
                            text: 'Centímetros'
                        }
                    },
                    title: {
                        text: '',
                        align: 'center'
                    }
                }}
                series={[
                    {
                        name: 'Altura (cm)',
                        data: [altura]
                    }
                ]}
                type="bar"
                height="100%"
                width="100%"
            />
        </div>
    );
};

export default HeightChart;
