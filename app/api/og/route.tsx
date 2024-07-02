import axios from "axios";
import { ImageResponse } from "next/og";
import { getPrimeBalance } from "../../../lib/contract";

// Route segment config
export const runtime = "edge";

// Image generation
export async function GET(request: Request) {
	const responseSupply = await axios.get("https://echelon.io/api/supply/");
	const primeSupply = responseSupply.data.circulatingSupply;

	const response = await fetch(
		"https://api.coinbase.com/v2/exchange-rates?currency=PRIME"
	);
	const data = await response.json();
	const primeValue = parseFloat(data.data.rates.USD);

	const primeBalance = parseFloat(await getPrimeBalance());
	const totalStakedValueInUSD = primeBalance * primeValue;
	const totalPercentageStaked = (primeBalance / primeSupply) * 100;

	// const { searchParams } = new URL(request.url);
	// const primeBalance = Number(searchParams.get("primeBalance"));
	// const totalStakedValueInUSD = Number(searchParams.get("totalStakedValueInUSD"));
	// const totalPercentageStaked = Number(searchParams.get("totalPercentageStaked"));

	const formatNumberWithCommas = (number: number) => {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	const oxaniumMedium = fetch(
		new URL("../../Oxanium-Medium.ttf", import.meta.url)
	).then((res) => res.arrayBuffer());

	return new ImageResponse(
		(
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					width: "100%",
					height: "100%",
					textAlign: "center",
					color: "white",
					backgroundImage:
						"url(https://wayfinder-staking.vercel.app/assets/bg.png)",
					backgroundSize: "100% 100%",
					backgroundPosition: "center",
				}}
			>
				<div
					style={{
						background:
							"linear-gradient(45deg, rgba(73,73,73,0.5) 0%, rgba(184, 182, 140, 0.5) 100%)",
						overflow: "hidden",
						borderRadius: "0.375rem",
						boxShadow:
							"0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
						fontSize: "1.5rem",
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						alignItems: "flex-start",
						padding: "2rem",
						width: "90%",
						height: "80%",
						position: "relative",
					}}
				>
					<div
						style={{
							fontSize: "2rem",
							color: "#E4DF59",
						}}
					>
						WAYFINDER STAKING
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							fontSize: "2.5rem",
						}}
					>
						<p style={{ margin: "0", display: "flex", alignItems: "center" }}>
							There are currently
							<span
								style={{ color: "#F0EEB1", padding: "0 5px", fontSize: "3rem" }}
							>
								{formatNumberWithCommas(primeBalance)}
							</span>
							$PRIME
						</p>
						<p
							style={{
								margin: "0 0 2rem 0",
								display: "flex",
								alignItems: "center",
							}}
						>
							staked ({formatNumberWithCommas(totalStakedValueInUSD)} $USD)
						</p>
						<p style={{ margin: "0", display: "flex", alignItems: "center" }}>
							This is about
							<span
								style={{ color: "#F0EEB1", padding: "0 8px", fontSize: "3rem" }}
							>
								{totalPercentageStaked.toFixed(2)}%
							</span>
							of the total
						</p>
						<p style={{ margin: "0", display: "flex", alignItems: "center" }}>
							circulating supply
						</p>
					</div>
					<div
						style={{
							fontSize: "1.5rem",
							width: "100%",
							color: "#9ca3af",
							display: "flex",
							justifyContent: "flex-end",
						}}
					>
						by x.com/Simo1028
					</div>
				</div>
			</div>
		),
		{
			width: 1100,
			height: 630,
			fonts: [
				{
					name: "Oxanium",
					data: await oxaniumMedium,
					style: "normal",
					weight: 400,
				},
			],
		}
	);
}
