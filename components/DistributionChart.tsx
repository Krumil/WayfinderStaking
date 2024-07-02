// /components/DistributionChart.tsx
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
	plugins,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface DistributionChartProps {
	weeks: string[];
	amounts: number[];
}

const DistributionChart: React.FC<DistributionChartProps> = ({
	weeks,
	amounts,
}) => {
	const data = {
		labels: weeks,
		responsive: true,
		datasets: [
			{
				data: amounts,
				backgroundColor: "rgba(75, 192, 192, 0.6)",
				borderColor: "rgba(75, 192, 192, 1)",
				borderWidth: 1,
			},
		],
	};

	const options = {
		maintainAspectRatio: false,
		indexAxis: "y" as const,
		scales: {
			y: {
				beginAtZero: true,
			},
		},
		plugins: {
			legend: {
				display: false,
			},
			title: {
				display: false,
			},
		},
	};

	return <Bar data={data} options={options} height="600px" />;
};

export default DistributionChart;
