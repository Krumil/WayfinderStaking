import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/utils";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const query = searchParams.get('query');

		if (!query) {
			return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
		}

		// Get all addresses up to and including the searched address
		const apiUrl = getApiUrl(`/search_position?query=${query}`);
		const response = await axios.get(apiUrl);

		// The response now includes:
		// - addresses: all addresses up to and including the searched one
		// - position: position of the searched address
		// - total_addresses: total number of addresses
		// - queried_as: original query string
		// - resolved_address: resolved Ethereum address
		return NextResponse.json(response.data);
	} catch (error: any) {
		console.error("Error searching address:", error);
		if (error.response?.status === 404) {
			return NextResponse.json(
				{ error: "Address not found in the leaderboard" },
				{ status: 404 }
			);
		}
		return NextResponse.json(
			{ error: "An error occurred while searching" },
			{ status: 500 }
		);
	}
} 