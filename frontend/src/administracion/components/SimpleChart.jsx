import Chart from "react-apexcharts";
import PropTypes from "prop-types";

const SimpleChart = ({ labels = [], series = [] }) => {
  const options = {
    chart: {
      type: "pie",
      height: 300,
      toolbar: {
        show: false,
      },
    },
    labels,
    legend: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} respuestas`,
      },
    },
    colors: [
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#EC4899",
      "#0EA5E9",
    ],
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`,
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        colors: ["#fff"],
      },
    },
  };

  return (  
      <div className="flex">
        {/* Gráfico a la izquierda */}
        <div className="">
          <Chart options={options} series={series} type="pie" height={300} />
        </div>

        {/* Leyenda a la derecha */}
        <div className="flex flex-col justify-center text-sm space-y-2">
          {labels.map((label, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor:
                    options.colors[index % options.colors.length],
                }}
              ></div>
              <span className="text-gray-800">{label}</span>
            </div>
          ))}
        </div>
      </div>
  );
};

SimpleChart.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  series: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default SimpleChart;
