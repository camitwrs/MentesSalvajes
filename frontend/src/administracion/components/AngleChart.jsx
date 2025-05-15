import Chart from "react-apexcharts"
import PropTypes from "prop-types"
import { useEffect, useState } from "react"

const AngleChart = ({ series, labels, windowWidth = 1200 }) => {
  const [chartHeight, setChartHeight] = useState(390)

  useEffect(() => {
    const handleResize = () => {
      if (windowWidth < 480) {
        setChartHeight(320)
      } else if (windowWidth < 768) {
        setChartHeight(350)
      } else {
        setChartHeight(390)
      }
    }

    handleResize()
  }, [windowWidth])

  const options = {
    chart: {
      type: "radialBar",
      height: chartHeight,
      fontFamily: "inherit",
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: windowWidth < 480 ? "25%" : "30%",
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
          fontSize: windowWidth < 480 ? "12px" : "14px",
          formatter: (seriesName, opts) => `${seriesName}: ${opts.w.globals.series[opts.seriesIndex]}`,
        },
        track: {
          show: true,
          background: "#f1f5f9",
        },
      },
    },
    labels,
    colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5", "#22c55e", "#f59e0b", "#ef4444"],
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: windowWidth < 480 ? "10px" : "14px",
      fontWeight: 500,
      offsetY: 10,
      markers: {
        width: 12,
        height: 12,
        radius: 12,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          legend: {
            fontSize: "12px",
            offsetY: 0,
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          legend: {
            show: false,
            position: "bottom",
            fontSize: "10px",
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: "25%",
              },
            },
          },
        },
      },
    ],
  }

  return (
    <div className="w-full overflow-hidden">
      <Chart options={options} series={series} type="radialBar" height={chartHeight} width="100%" />
    </div>
  )
}

AngleChart.propTypes = {
  series: PropTypes.arrayOf(PropTypes.number).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string,
  windowWidth: PropTypes.number,
}

AngleChart.defaultProps = {
  title: "Respuestas",
  windowWidth: 1200,
}

export default AngleChart