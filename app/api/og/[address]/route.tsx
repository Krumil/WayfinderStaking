import { ImageResponse } from "next/og";
import { getAddressFromENS, getENSNameFromAddress } from "@/lib/contract";
import { formatNumberWithCommas, getOrdinalIndicator } from "@/lib/utils";

export const runtime = "edge";

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

		// Get total users from the response data
		const totalUsers = data.total_users;

		// Calculate values
		const userPrimeCached = (Number(userData.base_prime_amount_cached || 0) + Number(userData.prime_amount_cached || 0)) / 1e18; // Convert from wei
		const percentage = Number(userData.percentage || 0).toPrecision(4);

		// Calculate estimated PROMPT tokens and value
		const stakingRewards = 1000000; // 1M PROMPT tokens
		const earnedPromptTokens = (Number(userData.percentage) / 100) * stakingRewards;
		const promptPrice = 1000000000 / stakingRewards; // $1B valuation / total supply
		const estimatedValue = earnedPromptTokens * promptPrice;

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
						background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
						position: "relative",
					}}
				>
					<div
						style={{
							background:
								"linear-gradient(45deg, rgba(73,73,73,0.8) 0%, rgba(184, 182, 140, 0.8) 100%)",
							overflow: "hidden",
							borderRadius: "24px",
							boxShadow:
								"0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
							fontSize: "1.5rem",
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
							alignItems: "flex-start",
							padding: "3rem",
							width: "100%",
							height: "100%",
							position: "relative",
							zIndex: 2,
							border: "1px solid rgba(255,255,255,0.1)",
						}}
					>
						<div
							style={{
								fontSize: "72px",
								fontWeight: "bold",
								display: "flex",
								alignItems: "center",
								color: "#F0EEB1",
								marginBottom: "20px",
							}}
						>
							{titleCard}
						</div>
						<div
							style={{
								fontSize: "36px",
								textAlign: "left",
								display: "flex",
								flexDirection: "column",
								alignItems: "flex-start",
								justifyContent: "flex-start",
								gap: "32px",
								marginTop: "20px",
								flex: 1,
							}}
						>
							<div style={{
								display: "flex",
								flexDirection: "column",
								gap: "24px",
								color: "#ffffff",
								fontSize: "36px",
								lineHeight: "1.4",
							}}>
								<div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
									<div style={{ display: "flex" }}>
										This address has staked{" "}
										<span style={{ color: "#F0EEB1", fontWeight: "bold", margin: "0 8px" }}>
											{formatNumberWithCommas(userPrimeCached)} $PRIME
										</span>,
									</div>
									<div style={{ display: "flex" }}>
										giving a Contribution Score of{" "}
										<span style={{ color: "#F0EEB1", fontWeight: "bold", marginLeft: "8px" }}>
											{formatNumberWithCommas(userData.total_score)}
										</span>
									</div>
								</div>

								<div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
									<div style={{ display: "flex" }}>
										This is{" "}
										<span style={{ color: "#F0EEB1", fontWeight: "bold", margin: "0 8px" }}>
											{percentage}%
										</span>
										of the total score,
									</div>
									<div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
										earning{" "}
										<span style={{ color: "#F0EEB1", fontWeight: "bold", margin: "0 8px" }}>
											{formatNumberWithCommas(Math.round(earnedPromptTokens))} $PROMPT
										</span>
										tokens (≈{" "}
										<span style={{ color: "#F0EEB1", fontWeight: "bold", margin: "0 8px" }}>
											${formatNumberWithCommas(Math.round(estimatedValue))}
										</span>
										at $1B FDV)
									</div>
								</div>
							</div>
						</div>

						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								width: "100%",
								marginTop: "auto",
								paddingTop: "20px",
								borderTop: "1px solid rgba(255,255,255,0.1)",
							}}
						>
							<div
								style={{
									display: "flex",
									alignItems: "baseline",
									gap: "4px",
								}}
							>
								<div style={{ color: "#9ca3af", fontSize: "32px", marginRight: "12px" }}>Rank</div>
								<span style={{ fontSize: "72px", color: "#F0EEB1", fontWeight: "bold", lineHeight: "1" }}>
									{userData.position}
								</span>
								<sup style={{ fontSize: "24px", color: "#F0EEB1" }}>
									{getOrdinalIndicator(userData?.position || 0)}
								</sup>
								<span style={{ fontSize: "32px", color: "#9ca3af", marginLeft: "8px" }}> / {totalUsers}</span>
							</div>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "flex-end",
									gap: "4px",
								}}
							>
								<div
									style={{
										fontSize: "28px",
										color: "#F0EEB1",
										fontWeight: "bold",
									}}
								>
									@Simo1028
								</div>
								<div
									style={{
										fontSize: "20px",
										color: "#9ca3af",
									}}
								>
									wayfinder-staking.vercel.app
								</div>
							</div>
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
		console.error('Error generating OG image:', error);

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
						textAlign: "center",
						padding: "50px",
						color: "white",
						background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
						position: "relative",
					}}
				>
					<div
						style={{
							fontSize: "48px",
							fontWeight: "bold",
							color: "#F0EEB1",
							marginBottom: "20px",
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
						Loading staking data...
					</div>
					<div
						style={{
							position: "absolute",
							bottom: "20px",
							right: "20px",
							fontSize: "24px",
							color: "#F0EEB1",
						}}
					>
						@Simo1028
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