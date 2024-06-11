import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Highcharts from "highcharts";
import Highcharts3D from "highcharts/highcharts-3d";
import HighchartsReact from "highcharts-react-official";

Highcharts3D(Highcharts);

const pastelColors = [
	"#554B39", // judge-gray-200
	"#B4AA99", // judge-gray-300
	"#F98556", // judge-gray-500
	"#402E32", // judge-gray-600
	"#B38B1A", // judge-gray-800
	"#005668", // oasis-400
	"#75394D", // oasis-500
	"#E69C7A", // oasis-600
	"#FFC2B1", // oasis-700
	"#942f0c" // oasis-800
];

interface DistributionChartProps {
	pieData: any;
}

const DistributionChart: React.FC<DistributionChartProps> = ({ pieData }) => {
	const [chartOptions, setChartOptions] = useState({});
	const router = useRouter();

	useEffect(() => {
		const options = {
			chart: {
				type: "pie",
				options3d: {
					enabled: true,
					alpha: 45
				},
				backgroundColor: "transparent"
			},
			title: {
				text: ""
			},
			plotOptions: {
				pie: {
					depth: 50,
					colors: pastelColors, // Set pastel colors here
					dataLabels: {
						enabled: true,
						color: "#000000", // Set label color here
						style: {
							fontSize: "14px",
							fontWeight: "bold"
						}
					},
					point: {
						events: {
							click: function (e: any) {
								const address = e.point.options.fullAddress;
								if (address !== "Others") {
									router.push(`/address/${address}`);
								}
							}
						}
					}
				}
			},
			series: [
				{
					name: "$PROMPT",
					data: pieData.map(([shortLabel, value, fullAddress]: [string, number, string], index: number) => ({
						name: shortLabel,
						y: value,
						fullAddress: fullAddress,
						color: pastelColors[index % pastelColors.length] // Apply pastel color
					}))
				}
			]
		};

		setChartOptions(options);
	}, [pieData, router]);

	return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default DistributionChart;
