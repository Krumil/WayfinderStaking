import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/utils";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const page = searchParams.get('page') || '1';
		const pageSize = searchParams.get('pageSize') || '10';

		const apiUrl = getApiUrl(`/addresses?page=${page}&page_size=${pageSize}`, true);
		const response = await axios.get(apiUrl);
		return NextResponse.json(response.data);

	} catch (error) {
		console.error("Error fetching addresses data:", error);
		return NextResponse.json(
			{ error: "An error occurred while fetching data" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const { addresses } = await request.json();
		const apiUrl = getApiUrl("/addresses", true);
		const response = await axios.post(apiUrl, { addresses });
		return NextResponse.json(response.data);
	} catch (error) {
		console.error("Error posting address data:", error);
		return NextResponse.json(
			{ error: "An error occurred while processing your request" },
			{ status: 500 }
		);
	}
}
