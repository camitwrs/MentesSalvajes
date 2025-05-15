import Chart from "react-apexcharts"
import PropTypes from "prop-types"
import { useEffect, useState } from "react"

const ColumnChart = ({ series, categories, windowWidth = 1200 }) => {
  const [chartHeight, setChartHeight] = useState(380)

  useEffect(() => {
    const handleResize = () => {
      if (windowWidth < 480) {
        setChartHeight(300)
      } else if (windowWidth < 768) {
        setChartHeight(340)
      } else {
        setChartHeight(380)
      }
    }

    handleResize()
  }, [windowWidth])

  const options = {
    chart: {
      type: "bar",
      height: chartHeight,
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: windowWidth < 480 ? "85%" : windowWidth < 768 ? "70%" : "60%",
        distributed: false,
      },
    },
    xaxis: {
      categories,
      labels: {
        rotate: -45,
        style: {
          fontSize: windowWidth < 480 ? "10px" : "12px",
          colors: Array(categories.length).fill("#64748b"),
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        formatter: (val) => `${val}`,
        style: {
          fontSize: windowWidth < 480 ? "10px" : "12px",
        },
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
      style: {
        fontSize: windowWidth < 480 ? "10px" : "12px",
        fontWeight: "bold",
      },
      offsetY: -20,
    },
    colors: ["#3B82F6"],
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "70%",
            },
          },
          dataLabels: {
            style: {
              fontSize: "11px",
            },
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "85%",
            },
          },
          dataLabels: {
            style: {
              fontSize: "9px",
            },
          },
        },
      },
    ],
  }

  return (
    <div className="w-full overflow-hidden">
      <Chart options={options} series={series} type="bar" width="100%" height={chartHeight} />
    </div>
  )
}

ColumnChart.propTypes = {
  series: PropTypes.array.isRequired, // Ej: [{ name: 'Respuestas', data: [5,10,15] }]
  categories: PropTypes.array.isRequired, // Ej: ['Sí', 'No', 'Tal vez']
  title: PropTypes.string,
  windowWidth: PropTypes.number,
}

ColumnChart.defaultProps = {
  title: "Respuestas",
  windowWidth: 1200,
}

export default ColumnChart
