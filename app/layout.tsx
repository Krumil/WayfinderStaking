import type { Metadata } from "next";
import { Oxanium } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";

const inter = Oxanium({ weight: ["400", "500", "600", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
	title: "$PROMPT Staking Dashboard",
	description: "$PROMPT Staking Dashboard"
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' data-theme='dark'>
			<body
				className={`${inter.className} bg-cover bg-center h-screen flex flex-col justify-center items-center overflow-hidden`}
				style={{ backgroundImage: `url(/assets/bg.png)` }}>
				<Header />
				<div className='background-gradient' />
				<div className='flex-1 w-full overflow-y-auto'>{children}</div>
			</body>
		</html>
	);
}
