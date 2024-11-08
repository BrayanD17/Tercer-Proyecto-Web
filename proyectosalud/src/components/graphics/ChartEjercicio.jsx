import React from "react";
import Chart from "react-apexcharts";

const ChartEjercicio = ({ data, title }) => {
  // Asumimos que 'data' tiene 'value' para la duración (en minutos) y 'cantidad' para la cantidad de ejercicios
  const seriesData = [
    {
      name: `${title} - Duración (minutos)`,
      data: data.map((item) => ({ x: item.date, y: item.value })), // Duración de ejercicio en minutos
    },
    {
      name: `${title} - Cantidad de ejercicios`,
      data: data.map((item) => ({ x: item.date, y: item.cantidad })), // Cantidad de ejercicios realizados
    },
  ];

  const chartOptions = {
    chart: {
      type: "area",
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
          text: "Duración (minutos)",
        },
      },
      {
        opposite: true,
        title: {
          text: "Cantidad de ejercicios",
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
      <Chart options={chartOptions} series={seriesData} type="area" height="100%" width="100%" />
    </div>
  );
};

export default ChartEjercicio;
