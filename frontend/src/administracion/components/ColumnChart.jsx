import Chart from "react-apexcharts";
import PropTypes from "prop-types";

const ColumnChart = ({ series, categories }) => {
  const options = {
    chart: {
      type: "bar",
      height: 380,
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories,
      labels: {
        rotate: -45,
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      tickAmount: 5, // divide el eje en 5 segmentos
      labels: {
        formatter: (val) => `${val}`,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} respuestas`,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}`,
    },
    colors: ["#3B82F6"],
  };

  return (
    <div>
      <Chart
        options={options}
        series={series}
        type="bar"
        width="100%"
        height={380}
      />
    </div>
  );
};

ColumnChart.propTypes = {
  series: PropTypes.array.isRequired, // Ej: [{ name: 'Respuestas', data: [5,10,15] }]
  categories: PropTypes.array.isRequired, // Ej: ['Sí', 'No', 'Tal vez']
  title: PropTypes.string,
};

ColumnChart.defaultProps = {
  title: "Respuestas",
};

export default ColumnChart;
