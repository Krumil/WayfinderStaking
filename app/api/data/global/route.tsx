import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const response = await fetch('https://api.coingecko.com/api/v3/coins/echelon-prime');
		const data = await response.json();

		const circulatingSupply = data.market_data?.circulating_supply || 1111111111;

		return NextResponse.json({
			circulatingSupply,
			totalSupply: data.market_data?.total_supply,
			maxSupply: data.market_data?.max_supply,
			lastUpdated: data.market_data?.last_updated,
			contracts: {
				ethereum: data.platforms?.ethereum,
				base: data.platforms?.base
			}
		});
	} catch (error) {
		console.error('Error fetching global data:', error);
		return NextResponse.json({
			circulatingSupply: 1111111111,
			error: 'Failed to fetch global data'
		});
	}
}