import axios from "axios";
import { NextResponse } from "next/server";
import { getApiUrl } from "@/lib/utils";

export async function GET() {
	try {
		const apiUrl = getApiUrl("/ens");
		const response = await axios.get(apiUrl);
		return NextResponse.json(response.data);
	} catch (error) {
		console.error("Error fetching ENS data:", error);
		return NextResponse.json(
			{ error: "An error occurred while fetching ENS data" },
			{ status: 500 }
		);
	}
}