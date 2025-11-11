"use client";

import Chart from "react-apexcharts";

const SharedChart = ({ series }) => {
  const values = [];

  if (series !== undefined) {
    series.forEach((item) => {
      values.push({ name: item.title, data: [item.percent.toFixed(1)] });
    });
  }
  const data = {
    series: values,
    options: {
      chart: {
        height: 150,
        type: "bar",
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: "80%",
          barHeight: "100%",
          dataLabels: {
            position: "top",
          },
        },
      },
      stroke: {
        show: true,
        width: 4,
        colors: ["transparent"],
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          if (val > 1) {
            return val + "%";
          }

          return "";
        },
        offsetX: 55,
        style: {
          fontSize: "20px",
          fontFamily: "SF-Pro",
          fontWeight: 400,
          colors: ["#00C0F3"],
        },
      },
      colors: [
        "#0186A9",
        "#F16A60",
        "#00C0F3",
        "#E265EC",
        "#34C38F",
        "#FFA370",
      ],
      legend: {
        show: true,
        position: "right",
        offsetY: -20,
        markers: {
          radius: "50%",
          strokeColor: "red",
          strokeWidth: 1,
          offsetX: -3,
        },
      },
      xaxis: {
        categories: ["Shared"],
        position: "center",
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        labels: {
          show: false,
        },
        tooltip: {
          enabled: true,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val + "%";
          },
        },
        max: function (max) {
          return max + 80;
        },
      },
      title: {
        text: "Monthly Inflation in Argentina, 2002",
        floating: true,
        offsetY: 330,
        align: "center",
        style: {
          color: "#444",
        },
      },
    },
  };

  return (
    <Chart
      options={data.options}
      series={data.series}
      type="bar"
      width="100%"
      height={150}
    />
  );
};

SharedChart.displayName = "SharedChart";

export default SharedChart;
