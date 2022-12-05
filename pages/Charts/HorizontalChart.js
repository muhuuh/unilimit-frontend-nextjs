import React, { useRef, useState } from "react";
import { getRelativePosition } from "chart.js/helpers";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HorizontalChart = () => {
  const [positionClicked, setPositionClicked] = useState({ x: 0, y: 0 });
  const [positionYMoved, setPositionYMoved] = useState(0);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "USDC/WETH Chart",
      },
    },
    scales: {
      y: {
        min: 0,
        max: 10,
      },
    },
  };
  const arrayX = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const valueY = [];
  arrayX.map(() => valueY.push(positionClicked.y));

  const chartData = {
    labels: arrayX,
    datasets: [
      {
        type: "line",
        label: "Limit Order-Id 1",
        data: valueY,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0)",
      },
    ],
  };

  const chartRef = useRef(null);

  const onClickHandler = (event) => {
    const chart = chartRef.current;
    const canvasPosition = getRelativePosition(event, chart);

    // Substitute the appropriate scale IDs
    const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
    const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);

    setPositionClicked({ x: dataX, y: dataY });
  };

  const onMouseMove = (event) => {
    console.log("mouse moving");
    console.log(event);

    const chart = chartRef.current;
    const canvasPosition = getRelativePosition(event, chart);

    // Substitute the appropriate scale IDs
    const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);

    setPositionYMoved(dataY);
  };

  return (
    <div className="text-center mb-8">
      <div className="mb-6">
        <div>Hovering over Price: </div>
        {positionYMoved.toFixed(4)}
      </div>
      <Chart
        ref={chartRef}
        type="line"
        options={options}
        data={chartData}
        onClick={onClickHandler}
        onMouseMove={onMouseMove}
      />
    </div>
  );
};

export default HorizontalChart;
