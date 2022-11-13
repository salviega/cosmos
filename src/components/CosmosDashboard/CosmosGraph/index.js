import "./CosmosLineGraph.scss";
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
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function CosmosLineGraph({ graphInformation }) {
  let xAxes = [];
  let yAxes = [];
  graphInformation.map((datum) => {
    xAxes.push(datum.x);
  });
  graphInformation.map((datum) => {
    yAxes.push(datum.y);
  });

  xAxes = xAxes.map((datum) => {
    let milliseconds = datum * 1000;
    let dateObject = new Date(milliseconds);
    let humanDateFormat = dateObject.toLocaleString([], {
      hour12: false,
    });
    return humanDateFormat;
  });
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Lastest activity",
      },
    },
  };
  const data = {
    labels: xAxes,
    datasets: [
      {
        label: "CO2",
        data: yAxes,
        borderColor: "rgba(243, 114, 181, 0.8)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return (
    <div className="container">
      <Line options={options} data={data} />
    </div>
  );
}
