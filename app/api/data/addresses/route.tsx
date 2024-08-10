import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/utils";

export async function GET() {
	try {
		const apiUrl = getApiUrl("/addresses");
		debugger;
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
		debugger;
		const { addresses } = await request.json();
		const apiUrl = getApiUrl("/addresses");
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
