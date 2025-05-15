import Chart from "react-apexcharts";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const SimpleChart = ({ labels = [], series = [], windowWidth = 1200 }) => {
  const [chartHeight, setChartHeight] = useState(300);
  const [layout, setLayout] = useState("horizontal");

  useEffect(() => {
    const handleResize = () => {
      if (windowWidth < 480) {
        setChartHeight(250);
        setLayout("vertical");
      } else if (windowWidth < 768) {
        setChartHeight(280);
        setLayout("horizontal");
      } else {
        setChartHeight(300);
        setLayout("horizontal");
      }
    };

    handleResize();
  }, [windowWidth]);

  const options = {
    chart: {
      type: "pie",
      height: chartHeight,
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
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
        fontSize: windowWidth < 480 ? "10px" : "14px",
        fontWeight: "bold",
        colors: ["#fff"],
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 280,
          },
          dataLabels: {
            style: {
              fontSize: "12px",
            },
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 250,
          },
          dataLabels: {
            style: {
              fontSize: "10px",
            },
          },
        },
      },
    ],
  };

  return (
    <div
      className={`w-full ${
        layout === "horizontal" ? "flex flex-row" : "flex flex-col"
      } gap-4`}
    >
      {/* Gráfico */}
      <div className={`${layout === "horizontal" ? "w-3/4" : "w-full"}`}>
        <Chart
          options={options}
          series={series}
          type="pie"
          height={chartHeight}
          width="100%"
        />
      </div>

      {/* Leyenda */}
      <div
        className={`${layout === "horizontal" ? "w-1/4" : "w-full"} flex ${
          layout === "horizontal" ? "flex-col" : "flex-row flex-wrap"
        } justify-center text-sm gap-2 p-2`}
      >
        {labels.map((label, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{
                backgroundColor: options.colors[index % options.colors.length],
              }}
            ></div>
            <span className="text-gray-800 text-xs sm:text-sm">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

SimpleChart.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  series: PropTypes.arrayOf(PropTypes.number).isRequired,
  windowWidth: PropTypes.number,
};

SimpleChart.defaultProps = {
  windowWidth: 1200,
};

export default SimpleChart;
