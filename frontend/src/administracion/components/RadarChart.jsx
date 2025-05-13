import Chart from "react-apexcharts";
import PropTypes from "prop-types";

const RadarChart = ({ series, categories }) => {
  const options = {
    chart: {
      type: "radar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        formatter: (val) => `${val}`,
      },
    },
    dataLabels: {
      enabled: true,
    },
    colors: ["#6366F1"], // Indigo-500
  };

  return (
    <div>
      <Chart
        options={options}
        series={series}
        type="radar"
        width="100%"
        height={500}
      />
    </div>
  );
};

RadarChart.propTypes = {
  series: PropTypes.array.isRequired, // Ej: [{ name: 'Respuestas', data: [10, 20, 5] }]
  categories: PropTypes.array.isRequired, // Ej: ['Sí', 'No', 'Tal vez']
  title: PropTypes.string,
};

RadarChart.defaultProps = {
  title: "Respuestas",
};

export default RadarChart;
