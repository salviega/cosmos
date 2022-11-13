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
    labels: graphInformation.y,
    datasets: [
      {
        label: "CO2",
        data: graphInformation.x,
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
