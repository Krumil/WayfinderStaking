import { ImageResponse } from "next/og";
import { getAddressFromENS, getENSNameFromAddress } from "@/lib/contract";
import { formatNumberWithCommas } from "@/lib/utils";

export const runtime = "edge";

function getOrdinalIndicator(number: number) {
	const j = number % 10,
		k = number % 100;
	if (j == 1 && k != 11) return "st";
	if (j == 2 && k != 12) return "nd";
	if (j == 3 && k != 13) return "rd";
	return "th";
}

export async function GET(
	request: Request,
	{ params }: { params: { address: string } }
) {
	try {
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

		// Fetch real user data
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL || 'https://wayfinder-staking.vercel.app'}/api/data/addresses`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ addresses: [address] }),
			}
		);

		if (!response.ok) {
			throw new Error('Failed to fetch user data');
		}

		const data = await response.json();
		const userData = data.addresses_found[0]?.data;

		if (!userData) {
			throw new Error('No data found for address');
		}

		// Get total users from global data
		const globalResponse = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL || 'https://wayfinder-staking.vercel.app'}/api/data/global`,
			{
				headers: {
					'Cache-Control': 'no-cache, no-store, must-revalidate',
					'Pragma': 'no-cache',
					'Expires': '0'
				}
			}
		);

		if (!globalResponse.ok) {
			throw new Error('Failed to fetch global data');
		}

		const globalData = await globalResponse.json();
		const totalUsers = globalData.total_addresses;

		const userPrimeCached = (Number(userData.base_prime_amount_cached || 0) + Number(userData.prime_amount_cached || 0)) / 1e18;
		const percentage = Number(userData.percentage || 0).toPrecision(2);
		const stakingRewards = 1000000;
		const earnedPromptTokens = (Number(userData.percentage) / 100) * stakingRewards;

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
						alignItems: "center",
						justifyContent: "center",
						width: "100%",
						height: "100%",
						background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
						padding: "48px",
					}}
				>
					<div
						style={{
							width: "100%",
							height: "100%",
							background: "linear-gradient(45deg, rgba(73,73,73,0.8) 0%, rgba(184, 182, 140, 0.8) 100%)",
							borderRadius: "16px",
							padding: "48px",
							display: "flex",
							flexDirection: "column",
							position: "relative",
							color: "white",
							border: "1px solid rgba(255,255,255,0.1)",
						}}
					>
						{/* Title */}
						<div
							style={{
								fontSize: "48px",
								fontWeight: "bold",
								color: "#F0EEB1",
								marginBottom: "32px",
							}}
						>
							{titleCard}
						</div>

						{/* Main Content */}
						<div
							style={{
								fontSize: "24px",
								display: "flex",
								flexDirection: "column",
								gap: "24px",
								flex: 1,
							}}
						>
							<div>
								This address has staked{" "}
								<span style={{ color: "#F0EEB1", fontWeight: "bold" }}>
									{formatNumberWithCommas(userPrimeCached)} $PRIME
								</span>
								, giving a Contribution Score of{" "}
								<span style={{ color: "#F0EEB1", fontWeight: "bold" }}>
									{formatNumberWithCommas(userData.total_score)}
								</span>
							</div>

							<div>
								This address is earning{" "}
								<span style={{ color: "#F0EEB1", fontWeight: "bold" }}>
									{percentage}%
								</span>{" "}
								of the total score, which is{" "}
								<span style={{ color: "#F0EEB1", fontWeight: "bold" }}>
									{formatNumberWithCommas(Math.round(earnedPromptTokens))}
								</span>{" "}
								$PROMPT.
							</div>
						</div>

						{/* Rank at bottom */}
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "baseline",
								marginTop: "auto",
								gap: "4px",
							}}
						>
							<span style={{ fontSize: "64px", color: "#F0EEB1", fontWeight: "bold", lineHeight: 1 }}>
								{userData.position}
							</span>
							<span style={{ fontSize: "24px", color: "#F0EEB1", verticalAlign: "super" }}>
								{getOrdinalIndicator(userData.position)}
							</span>
							<span style={{ fontSize: "24px", color: "#9ca3af", marginLeft: "4px" }}>
								/ {totalUsers}
							</span>
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

		return imageResponse;
	} catch (error) {
		console.error('Error generating card image:', error);

		// Create a fallback error image
		const oxaniumMedium = fetch(
			new URL("../../../Oxanium-Medium.ttf", import.meta.url)
		).then((res) => res.arrayBuffer());

		const errorResponse = new ImageResponse(
			(
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						width: "100%",
						height: "100%",
						background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
						padding: "48px",
						color: "white",
					}}
				>
					<div
						style={{
							fontSize: "48px",
							fontWeight: "bold",
							color: "#F0EEB1",
							marginBottom: "24px",
						}}
					>
						Wayfinder Staking
					</div>
					<div
						style={{
							fontSize: "32px",
							color: "#9ca3af",
						}}
					>
						Error loading staking data
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

		return errorResponse;
	}
} 