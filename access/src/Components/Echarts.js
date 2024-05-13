import React, { useEffect, useState, useRef, forwardRef } from "react";
import * as echarts from "echarts";
function drawChart(data, chartType, chartContainerRef) {
  const myChart = echarts.init(chartContainerRef.current);//Echart instance is created
  let option;
  if (chartType === "bar") {
    option = {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        text: "Service Costs",
        left: "center",
        top: "20px",
        textStyle: {
          fontSize: 30,
          fontWeight: "bold",
          color: "#58A399",
        },
        axisPointer: {
          show: false,
        },
      },
      grid: {
        left: "15%",
      },
      xAxis: {
        type: "category",
        data: data.map((item) => item.service),
        axisLabel: {
          rotate: 45,
          fontSize: 12,
          fontWeight: "bold",
          color: "white",
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          fontSize: 12,
          fontWeight: "bold",
          color: "white",
        },
      },
      tooltip: {
        trigger: "item",
        formatter: (params) => {
          const { name, value } = params;
          return `${name}: $${value}`;
        },
      },
      series: [
        {
          data: data.map((item) => item.cost),
          type: "bar",
          label: {
            show: true,
            position: "top",
            fontSize: 12,
            fontWeight: "bold",
            color: "white",
          },
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: "#47F3D0",
                },
                {
                  offset: 0.52,
                  color: "#278EF1",
                },
                {
                  offset: 1,
                  color: "#CB5EDC",
                },
              ],
              global: false,
            },
            borderColor: "black",
            borderWidth: 0.5,
          },
        },
      ],
    };
  } else if (chartType === "pie") {
    option = {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        text: "Service Costs",
        left: "center",
        top: "30px",
        textStyle: {
          fontSize: 30,
          fontWeight: "bold",
          color: "#58A399",
        },
      },
      xAxis: {
        show: false,
      },
      legend: {
        top: "bottom",
        right: "15%",
        textStyle: {
          fontSize: 16,
          fontWeight: "bold",
          color: "white",
        },
      },
      tooltip: {
        trigger: "item",
        textStyle: {
          fontWeight: "bold",
          color: "black",
        },
      },
      series: [
        {
          type: "pie",
          radius: ["40%", "70%"],
          center: ["50%", "50%"],
          itemStyle: {
            borderRadius: 10,
            borderColor: "white",
            borderWidth: 1,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: "bold",
              color: "white",
            },
          },
          labelLine: {
            show: false,
          },
          data: data.map((item) => ({
            name: item.service,
            value: item.cost,
          })),
        },
      ],
    };
  }

  myChart.setOption(option);
  window.addEventListener("resize", () => {
    myChart.resize();
  });
}

const Echarts = forwardRef((props, ref) => {//passing the ref from parent to child component
  const chartContainerRef = useRef(null);//chartContainerRef will hold a reference to the DOM element where the chart will be rendered
  const chartInstanceRef = useRef(null);//chartInstanceRef will hold a reference to the chart instance created 

  useEffect(() => {
    if (ref) {//if there is a ref
      ref.current = {
        getChartInstance: () => chartInstanceRef.current,//sets the current property of ref to an object with a getChartInstance method that returns the current chart instance (chartInstanceRef.current)
      };
    }
  }, [ref,chartInstanceRef.current]);

  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState("bar");
  const [data, setData] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://mocki.io/v1/9b604fc8-c1eb-4fe7-a224-436e9bb675ed")
      .then((response) => response.json())
      .then((data) => {
        setData(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (data) {
      const myChart = echarts.init(chartContainerRef.current);
      chartInstanceRef.current = myChart;
      drawChart(data, chartType, chartContainerRef);
    }
  }, [chartType, data]);

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        backgroundColor: "black",
        position: "absolute",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "20px",
        }}
      >
        <label
          htmlFor="chart-type"
          style={{ color: "white", fontWeight: "bold" }}
        >
          Chart Type:
        </label>
        <select
          id="chart-type"
          value={chartType}
          onChange={handleChartTypeChange}
          style={{ marginLeft: "10px" }}
        >
          <option value="bar">Bar Chart</option>
          <option value="pie">Doughnut Chart</option>
        </select>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          height: "100%",
        }}
      >
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div
            ref={chartContainerRef}
            style={{ width: "100%", height: "80vh" }}
          ></div>
        )}
      </div>
    </div>
  );
});

export default Echarts;
