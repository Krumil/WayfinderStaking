import { ImageResponse } from "next/og";
import { getAddressFromENS, getENSNameFromAddress } from "@/lib/contract";
import { formatNumberWithCommas } from "@/lib/utils";

export const runtime = "edge";

export async function GET(
	request: Request,
	{ params }: { params: { address: string } }
) {
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
		ensName = await getENSNameFromAddress(address);
	}

	// Fetch user data
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/data`, {
		method: "POST",
		body: JSON.stringify({ address }),
		headers: {
			"Content-Type": "application/json",
		},
	});
	const userData: UserData = await response.json();

	// Fetch global data
	const globalResponse = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/data/global`
	);
	const globalData = await globalResponse.json();

	const totalScore = globalData.total_score;
	const stakingRewards = 1000000; // Replace with actual staking rewards value

	const userPrimeCached =
		userData.total_prime_cached / 1_000_000_000_000_000_000;
	const percentage = userData.total_score
		? ((userData.total_score / totalScore) * 100).toPrecision(4)
		: "0";
	const earnedPromptTokens =
		(userData.total_score / totalScore) * stakingRewards;

	const titleCard = ensName || `${address.slice(0, 4)}...${address.slice(-4)}`;

	const oxaniumMedium = fetch(
		new URL("../../../Oxanium-Medium.ttf", import.meta.url)
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
					backgroundColor: "#1F2937",
					color: "white",
					fontFamily: "Oxanium",
					padding: "40px",
				}}
			>
				<div
					style={{
						fontSize: "36px",
						fontWeight: "bold",
						marginBottom: "20px",
					}}
				>
					{titleCard}
				</div>
				<div
					style={{
						fontSize: "24px",
						textAlign: "center",
						marginBottom: "20px",
					}}
				>
					You have staked{" "}
					<span style={{ color: "#F59E0B" }}>
						{formatNumberWithCommas(userPrimeCached)}
					</span>{" "}
					$PRIME
				</div>
				<div
					style={{
						fontSize: "24px",
						textAlign: "center",
						marginBottom: "20px",
					}}
				>
					Contribution Score:{" "}
					<span style={{ color: "#F59E0B" }}>
						{formatNumberWithCommas(userData.total_score)}
					</span>
				</div>
				<div
					style={{
						fontSize: "24px",
						textAlign: "center",
						marginBottom: "20px",
					}}
				>
					This is <span style={{ color: "#F59E0B" }}>{percentage}%</span> of the
					total score
				</div>
				<div
					style={{
						fontSize: "24px",
						textAlign: "center",
					}}
				>
					Earning you{" "}
					<span style={{ color: "#F59E0B" }}>
						{formatNumberWithCommas(earnedPromptTokens)}
					</span>{" "}
					$PROMPT
				</div>
				<div
					style={{
						position: "absolute",
						bottom: "20px",
						fontSize: "18px",
					}}
				>
					Rank: {userData.position} / {userData.total_users}
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
}