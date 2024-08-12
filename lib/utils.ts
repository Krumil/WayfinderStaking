import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

const promptSupply = 1e9;
const stakingRewards = promptSupply * 0.4;

const formatNumberWithCommas = (num: number) =>
	num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");


const getOrdinalIndicator = (number: number): string => {
	if (number % 100 >= 11 && number % 100 <= 13) {
		return "th";
	}
	switch (number % 10) {
		case 1: return "st";
		case 2: return "nd";
		case 3: return "rd";
		default: return "th";
	}
};

const fetchPrimeValue = async () => {
	try {
		const response = await fetch(
			"https://api.coinbase.com/v2/exchange-rates?currency=PRIME"
		);
		const data = await response.json();
		return parseFloat(data.data.rates.USD).toFixed(2);
	} catch (err: any) {
		console.error(err);
		return "";
	}
};


const getApiUrl = (endpoint: string) => {
	const apiUrl = process.env.NEXT_PUBLIC_ADDRESSES_API_URL + endpoint;
	if (!apiUrl) {
		throw new Error("NEXT_PUBLIC_ADDRESSES_API_URL is not defined");
	}
	return apiUrl;
};

const isMobile = typeof window !== 'undefined'
	? /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)
	: false;

export {
	fetchPrimeValue,
	formatNumberWithCommas,
	getApiUrl,
	promptSupply,
	stakingRewards,
	getOrdinalIndicator,
	isMobile,
};
