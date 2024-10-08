import { ImageResponse } from "next/og";
import { getAddressFromENS, getENSNameFromAddress } from "@/lib/contract";
import { formatNumberWithCommas, getOrdinalIndicator } from "@/lib/utils";

export const runtime = "edge";

export async function GET(
	request: Request,
	{ params }: { params: { address: string } }
) {
	// Prevent caching
	const { searchParams } = new URL(request.url);
	const preventCache = searchParams.get('preventCache') || Date.now();

	const addressParam = params.address.toLowerCase();
	let address: string;
	let ensName: string | null = null;

	if (addressParam.includes(".eth")) {
		const hexAddress = await getAddressFromENS(addressParam);
		if (!hexAddress) {
			return new Response("Invalid ENS name", { status: 400 });
		}
		address = hexAddress.toLowerCase();
		ensName = addressParam.toLowerCase();
	} else {
		address = addressParam;
		ensName = await getENSNameFromAddress(address, true);
	}

	// Fetch user data
	const response = await fetch(
		`https://wayfinder-staking.vercel.app/api/data`,
		{
			method: "POST",
			body: JSON.stringify({ address }),
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	const userData: UserData = await response.json();

	// Fetch global data
	const globalResponse = await fetch(
		`https://wayfinder-staking.vercel.app/api/data/global`
	);
	const globalData = await globalResponse.json();

	const totalScore = globalData.total_score;
	const stakingRewards = 1000000; // Replace with actual staking rewards value

	const userPrimeCached =
		userData.total_prime_cached / 1_000_000_000_000_000_000;
	const percentage = userData.percentage.toPrecision(4);
	const earnedPromptTokens =
		(userData.total_score / totalScore) * stakingRewards;

	const titleCard = ensName || `${address.slice(0, 8)}...${address.slice(-8)}`;

	const oxaniumMedium = fetch(
		new URL("../../../Oxanium-Medium.ttf", import.meta.url)
	).then((res) => res.arrayBuffer());

	const imageResponse = new ImageResponse(
		(
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-start",
					justifyContent: "space-around",
					width: "100%",
					height: "100%",
					textAlign: "center",
					padding: "50px",
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
						paddingBottom: "8rem",
						width: "100%",
						height: "100%",
						position: "relative",
					}}
				>
					<div
						style={{
							fontSize: "70px",
							fontWeight: "bold",
							display: "flex",
						}}
					>
						{titleCard}
					</div>
					<div
						style={{
							fontSize: "36px",
							textAlign: "center",
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-start",
							justifyContent: "flex-start",
						}}
					>
						<div style={{ display: "flex", marginBottom: "10px" }}>
							You have staked{" "}
							<span style={{ color: "#7f754f", margin: "0 8px" }}>
								{formatNumberWithCommas(userPrimeCached)}
							</span>{" "}
							, giving you a Contribution Score
						</div>
						<div style={{ display: "flex" }}>
							of{" "}
							<span style={{ color: "#7f754f", marginLeft: "8px" }}>
								{formatNumberWithCommas(userData.total_score)}
							</span>
						</div>
					</div>

					<div
						style={{
							fontSize: "36px",
							textAlign: "center",
							marginBottom: "20px",
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-start",
							justifyContent: "flex-start",
						}}
					>
						<div style={{ display: "flex", marginBottom: "10px" }}>
							This is{" "}
							<span style={{ color: "#7f754f", margin: "0 8px" }}>
								{percentage}%
							</span>{" "}
							of the total score, earning you
						</div>
						<div style={{ display: "flex" }}>
							<span style={{ color: "#7f754f", marginRight: "8px" }}>
								{formatNumberWithCommas(earnedPromptTokens)}
							</span>
							$PROMPT
						</div>
					</div>

					<div
						style={{
							display: "flex",
							alignItems: "flex-end",
							position: "absolute",
							bottom: "20px",
							left: "50%",
							fontSize: "32px",
						}}
					>
						<span
							style={{
								fontSize: "46px",
								marginRight: "4px",
								color: "#9ca3af",
							}}
						>
							{userData.position}
							<sup
								style={{
									fontSize: "16px",
								}}
							>
								{getOrdinalIndicator(userData?.position || 0)}
							</sup>
						</span>{" "}
						/ {userData.total_users}
					</div>
					<div
						style={{
							fontSize: "1.5rem",
							width: "100%",
							color: "#9ca3af",
							display: "flex",
							justifyContent: "flex-end",
							position: "absolute",
							bottom: "20px",
							right: "20px",
						}}
					>
						by x.com/Simo1028
					</div>
				</div>
			</div>
		),
		{
			width: 1200,
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

	// Set cache control headers
	imageResponse.headers.set('Cache-Control', 'no-store, max-age=0');

	return imageResponse;
}