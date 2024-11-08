import React from "react";
import Chart from "react-apexcharts";

const ChartAgua = ({ data, title }) => {
  // Asumimos que 'data' tiene 'value' para litros y 'vasos' para la cantidad de vasos
  const seriesData = [
    {
      name: `${title} - Litros`,
      data: data.map((item) => ({ x: item.date, y: item.value })), // Litros de agua
    },
    {
      name: `${title} - Vasos`,
      data: data.map((item) => ({ x: item.date, y: item.vasos })), // Vasos de agua
    },
  ];

  const chartOptions = {
    chart: {
      type: "line",
      height: 350,
      zoom: {
        enabled: true,
      },
    },
    xaxis: {
      type: "category",
      categories: data.map((item) => item.date),
      title: {
        text: "Fecha",
      },
    },
    yaxis: [
      {
        title: {
          text: "Cantidad (litros)",
        },
      },
      {
        opposite: true,
        title: {
          text: "Cantidad (vasos)",
        },
      },
    ],
    title: {
      text: title,
      align: "left",
    },
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Chart options={chartOptions} series={seriesData} type="line" height="100%" width="100%" />
    </div>
  );
};

export default ChartAgua;
