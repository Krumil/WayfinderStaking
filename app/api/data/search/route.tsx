import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/utils";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const address = searchParams.get('address');

		if (!address) {
			return NextResponse.json({ error: "Address parameter is required" }, { status: 400 });
		}

		// Get all addresses up to and including the searched address
		const apiUrl = getApiUrl(`/search_position?address=${address}`);
		const response = await axios.get(apiUrl);

		// The response should include:
		// - addresses: all addresses up to and including the searched one
		// - position: position of the searched address
		// - total_pages: total number of pages in the leaderboard
		return NextResponse.json(response.data);
	} catch (error) {
		console.error("Error searching address:", error);
		return NextResponse.json(
			{ error: "An error occurred while searching" },
			{ status: 500 }
		);
	}
} 