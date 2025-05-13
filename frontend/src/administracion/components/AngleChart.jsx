import Chart from "react-apexcharts";
import PropTypes from "prop-types";

const AngleChart = ({ series, labels}) => {
  const options = {
    chart: {
      type: "radialBar",
      height: 390,
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: "30%",
          background: "transparent",
        },
        dataLabels: {
          name: { show: false },
          value: { show: false },
        },
        barLabels: {
          enabled: true,
          useSeriesColors: true,
          offsetX: -8,
          fontSize: "14px",
          formatter: function (seriesName, opts) {
            return `${seriesName}: ${opts.w.globals.series[opts.seriesIndex]}`;
          },
        },
      },
    },
    labels,
    colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5", "#22c55e", "#f59e0b", "#ef4444"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: { show: false },
        },
      },
    ],
  };

  return (
    <div>
      <Chart options={options} series={series} type="radialBar" height={390} />
    </div>
  );
};

AngleChart.propTypes = {
  series: PropTypes.arrayOf(PropTypes.number).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string,
};

AngleChart.defaultProps = {
  title: "Respuestas",
};

export default AngleChart;
