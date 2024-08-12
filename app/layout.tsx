import type { Metadata, Viewport } from "next";
import { Oxanium } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
// import BuyMeACoffeeButton from "@/components/BuyMeACoffeButton";

const inter = Oxanium({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
});
const Header = dynamic(() => import("@/components/Header"));
const DisclaimerDialog = dynamic(() => import("@/components/DisclaimerDialog"));


export const metadata: Metadata = {
	title: 'Wayfinder Staking',
	description: 'Here you can see data about the staking of the Wayfinder Protocol',
	manifest: '/manifest.json',
	appleWebApp: {
		capable: true,
		statusBarStyle: 'default',
		title: 'Wayfinder Staking',
	},
	icons: {
		icon: '/assets/192.png',
		apple: '/assets/192.png',
	},
	openGraph: {
		title: "Wayfinder Staking",
		description:
			"Here you can see data about the staking of the Wayfinder Protocol",
		type: "article",
		url: "https://wayfinder-staking.vercel.app/",
		images: [
			{
				url: "https://wayfinder-staking.vercel.app//api/og",
			},
		],
	},
	twitter: {
		title: "Wayfinder Staking",
		description:
			"Here you can see data about the staking of the Wayfinder Protocol",
		images: ["https://wayfinder-staking.vercel.app/api/og"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" data-theme="dark">
			<body
				className={`${inter.className} bg-cover bg-center text-white h-screen flex flex-col justify-center items-center overflow-hidden`}
				style={{ backgroundImage: `url(/assets/bg.png)` }}
			>
				<Header className="md:pr-8" />
				<div className="background-gradient" />
				<div className="scrollable flex-1 w-full overflow-y-auto">
					{children}
					<SpeedInsights />
					<Analytics />
				</div>
				{/* <BuyMeACoffeeButton /> */}
				<DisclaimerDialog />
			</body>
		</html>
	);
}
