import type { Metadata } from "next";
import { Oxanium } from "next/font/google";
import dynamic from "next/dynamic";
import { getAddressFromENS, getENSNameFromAddress } from "@/lib/contract";

const inter = Oxanium({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
});

const Header = dynamic(() => import("@/components/Header"));
const DisclaimerDialog = dynamic(() => import("@/components/DisclaimerDialog"));

export async function generateMetadata({
	params,
}: {
	params: { address: string };
}): Promise<Metadata> {
	const addressParam = params.address.toLowerCase();

	let address: string;
	let ensName: string | null = null;

	if (addressParam.includes(".eth")) {
		const hexAddress = await getAddressFromENS(addressParam);
		if (!hexAddress) {
			address = addressParam;
		} else {
			address = hexAddress.toLowerCase();
			ensName = addressParam.toLowerCase();
		}
	} else {
		address = addressParam;
		ensName = await getENSNameFromAddress(address);
	}

	const displayName =
		ensName || `${address.slice(0, 4)}...${address.slice(-4)}`;

	const baseUrl =
		process.env.NEXT_PUBLIC_BASE_URL || "https://wayfinder-staking.vercel.app";

	return {
		metadataBase: new URL(baseUrl),
		title: `${displayName} | Wayfinder Staking`,
		description: `View staking details for ${displayName} on Wayfinder Staking`,
		openGraph: {
			title: `${displayName} | Wayfinder Staking`,
			description: `View staking details for ${displayName} on Wayfinder Staking`,
			url: `${process.env.NEXT_PUBLIC_API_URL}/address/${addressParam}`,
			images: [
				{
					url: `https://promptcachingdashboardserver.onrender.com/api/og/${addressParam}`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `${displayName} | Wayfinder Staking`,
			description: `View staking details for ${displayName} on Wayfinder Staking`,
			images: [
				`https://promptcachingdashboardserver.onrender.com/api/og/${addressParam}`,
			],
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
