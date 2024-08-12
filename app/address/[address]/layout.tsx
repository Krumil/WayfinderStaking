import type { Metadata } from "next";
import { Oxanium } from "next/font/google";
import { getAddressFromENS, getENSNameFromAddress } from "@/lib/contract";

const oxanium = Oxanium({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
});

export async function generateMetadata({
	params,
}: {
	params: { address: string };
}): Promise<Metadata> {
	let formattedParams = decodeURIComponent(params.address);
	const addressParams = formattedParams.toLowerCase().split(',').map(a => a.trim());
	const addressData = await Promise.all(addressParams.map(async (addressParam) => {
		let address: string;
		let ensName: string | null = null;
		const trimmedParam = addressParam.trim();


		if (trimmedParam.includes(".eth")) {
			const hexAddress = await getAddressFromENS(trimmedParam);
			if (!hexAddress) {
				address = trimmedParam;
			} else {
				address = hexAddress.toLowerCase();
				ensName = trimmedParam.toLowerCase();
			}
		} else {
			address = trimmedParam.toLowerCase();
			ensName = await getENSNameFromAddress(address, true);
		}

		return { address, ensName };
	}));

	const displayNames = addressData.map(({ address, ensName }) =>
		ensName || `${address.slice(0, 4)}...${address.slice(-4)}`
	);

	const displayName = displayNames.join(", ");

	const baseUrl =
		process.env.NEXT_PUBLIC_BASE_URL || "https://wayfinder-staking.vercel.app/";

	const title = addressData.length > 1
		? `Multiple Addresses | Wayfinder Staking`
		: `${displayName} | Wayfinder Staking`;

	const description = addressData.length > 1
		? `View combined staking details for multiple addresses on Wayfinder Staking`
		: `View staking details for ${displayName} on Wayfinder Staking`;

	return {
		metadataBase: new URL(baseUrl),
		title,
		description,
		openGraph: {
			siteName: "Wayfinder Staking",
			title,
			description,
			url: `https://wayfinder-staking.vercel.app/address/${params.address}`,
			images: [
				{
					url: `https://wayfinder-staking.vercel.app/api/og/${params.address}`,
				},
			],
		},
		twitter: {
			site: "@Simo1028",
			card: "summary_large_image",
			title,
			description,
			images: [`https://wayfinder-staking.vercel.app/api/og/${params.address}`],
		},
	};
}

export default function AddressLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div>{children}</div>;
}