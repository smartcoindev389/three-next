"use client";

import Chart from "react-apexcharts";

const DeviceChart = ({
  series,
  legendOffsetY = 0,
  legendOffsetX = 0,
  ...props
}) => {
  if (!series) return null;

  const labels = [];
  const values = series.map(({ title, percent }) => {
    labels.push(title);

    return parseFloat(percent.toFixed(2));
  });
  const options = {
    chart: {
      type: "donut",
    },
    dataLabels: {
      enabled: false,
    },
    labels,
    colors: ["#0186A9", "#00C0F3", "#F16A60"],
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: "50%",
        },
      },
    },
    legend: {
      position: "right",
      offsetY: legendOffsetY,
      offsetX: legendOffsetX,
      width: 140,
      markers: {
        radius: "50%",
        strokeColor: "red",
        strokeWidth: 1,
        offsetX: -3,
      },
    },
  };

  return <Chart options={options} series={values} type="donut" {...props} />;
};

DeviceChart.displayName = "DeviceChart";

export default DeviceChart;
