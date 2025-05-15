import Chart from "react-apexcharts"
import PropTypes from "prop-types"
import { useEffect, useState } from "react"

const RadarChart = ({ series, categories, windowWidth = 1200 }) => {
  const [chartHeight, setChartHeight] = useState(500)
  const [chartWidth, setChartWidth] = useState("100%")

  useEffect(() => {
    const handleResize = () => {
      if (windowWidth < 480) {
        setChartHeight(300)
      } else if (windowWidth < 768) {
        setChartHeight(400)
      } else {
        setChartHeight(500)
      }

      // Ensure chart is not wider than container on small screens
      setChartWidth("100%")
    }

    handleResize()
  }, [windowWidth])

  const options = {
    chart: {
      type: "radar",
      height: chartHeight,
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
    },
    xaxis: {
      categories,
      labels: {
        style: {
          fontSize: windowWidth < 480 ? "10px" : "12px",
          colors: Array(categories.length).fill("#64748b"),
        },
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
    dataLabels: {
      enabled: true,
      style: {
        fontSize: windowWidth < 480 ? "10px" : "12px",
        fontWeight: "bold",
      },
    },
    colors: ["#6366F1"], // Indigo-500
    markers: {
      size: 4,
      hover: {
        size: 6,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}`,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          stroke: {
            width: 2,
          },
          markers: {
            size: 3,
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
          stroke: {
            width: 1,
          },
          markers: {
            size: 2,
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
      <Chart options={options} series={series} type="radar" width={chartWidth} height={chartHeight} />
    </div>
  )
}

RadarChart.propTypes = {
  series: PropTypes.array.isRequired, // Ej: [{ name: 'Respuestas', data: [10, 20, 5] }]
  categories: PropTypes.array.isRequired, // Ej: ['Sí', 'No', 'Tal vez']
  title: PropTypes.string,
  windowWidth: PropTypes.number,
}

RadarChart.defaultProps = {
  title: "Respuestas",
  windowWidth: 1200,
}

export default RadarChart
