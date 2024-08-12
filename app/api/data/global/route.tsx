import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/utils";

export async function GET(req: NextRequest) {
	try {
		const apiUrl = getApiUrl("/get_global_data");

		// Add a timestamp to the URL to prevent caching
		const timestamp = new Date().getTime();
		const urlWithTimestamp = `${apiUrl}${apiUrl.includes('?') ? '&' : '?'}t=${timestamp}`;

		const response = await axios.get(urlWithTimestamp, {
			headers: {
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				'Pragma': 'no-cache',
				'Expires': '0'
			}
		});

		const nextResponse = NextResponse.json(response.data);
		nextResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
		nextResponse.headers.set('Pragma', 'no-cache');
		nextResponse.headers.set('Expires', '0');

		return nextResponse;
	} catch (error) {
		console.error("Error in API Route:", error);
		console.log('API Route Handler Completed with Error');
		return NextResponse.json(
			{ error: "An error occurred while fetching data" },
			{ status: 500 }
		);
	}
}