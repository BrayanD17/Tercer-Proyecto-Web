import React from "react";
import Chart from "react-apexcharts";

const ChartMusculo = ({ data, title }) => {
  // Filtrar datos válidos (eliminar NaN y valores infinitos)
  const validData = data.filter(item => !isNaN(item.value) && isFinite(item.value));

  const seriesData = [
    {
      name: title,
      data: validData.map(item => (isFinite(item.value) ? item.value : 0)) // Reemplazar infinitos por 0 o un valor por defecto
    },
  ];

  const chartOptions = {
    chart: {
      type: "bar", // Tipo de gráfico, puede cambiarse a 'line' si prefieres
      height: 350,
      zoom: {
        enabled: true,
      },
    },
    xaxis: {
      type: "category",
      // Usamos las fechas del data filtrado
      categories: validData.map((item) => item.date),
      title: {
        text: "Fecha",
      },
    },
    yaxis: {
      title: {
        text: "Músculo (%)",
      },
    },
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

export default ChartMusculo;
