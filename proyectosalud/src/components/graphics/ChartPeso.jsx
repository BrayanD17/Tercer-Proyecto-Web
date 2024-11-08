import React from "react";
import Chart from "react-apexcharts";

const ChartPeso = ({ data, title }) => {
  const seriesData = [
    {
      name: title,
      data: data.map((item) => ({ x: item.date, y: item.value })),
    },
  ];

  const chartOptions = {
    chart: {
      type: "bar",
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
    yaxis: {
      title: {
        text: "Peso (kg)",
      },
    },
    title: {
      text: title,
      align: "left",
    },
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Chart options={chartOptions} series={seriesData} type="bar" height="100%" width="100%" />
    </div>
  );
};

export default ChartPeso;
