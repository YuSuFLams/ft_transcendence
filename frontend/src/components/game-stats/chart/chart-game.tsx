import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { LeaderboardItem } from "../../utils/interface";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartsData: React.FC<{ leaderboard: LeaderboardItem[] }> = ({ leaderboard }) => {
	const barChartData = {
		labels: leaderboard.map((item) => item.player) ,
		datasets: [
			{ label: "Wins", data: leaderboard.map((item) => item.wins), backgroundColor: "#0E2F59", borderColor: "#0388A6", borderWidth: 2,},
			{ label: "Losses", data: leaderboard.map((item) => item.losses), backgroundColor: "#E11314", borderColor: "#E53A50", borderWidth: 2,},
		],
	};

	const chartOptions = {
		responsive: true,
		plugins: {
			tooltip: { backgroundColor: "rgba(0, 0, 0, 0.7)", titleColor: "#fff", bodyColor: "#fff", borderColor: "#fff", borderWidth: 1,},
			legend: { position: "top" as const, labels: { color: "#89BAD9", font: { family: 'Font1', size: 14,},},},
		},
		scales: {
			x: { ticks: { color: "#89BAD9", font: { family: 'Font1', size: 14,},}, grid: { color: "rgba(222, 29, 29, 0.1)",},},
			y: { ticks: { color: "#fff", font: { family: 'Font1', size: 14, },}, grid: { color: "rgba(255, 255, 255, 0.1)",},},
		},
	};

	return (
		<div className="z-[50] relative">
			<div className="flex flex-wrap justify-center items-center mt-12">
				<div className="w-full flex flex-col justify-center space-y-8 items-center h-[400px] px-4">
					<h3 className="text-3xl font-[Font6] text-blue-200 text-center">Player Wins & Losses</h3>
					{leaderboard.length > 0 && <Bar data={barChartData} options={chartOptions} />}
				</div>
			</div>
		</div>
	);
};

export default ChartsData;