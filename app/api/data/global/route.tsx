import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/utils";

export async function GET() {
	try {
		debugger;
		const apiUrl = getApiUrl("/get_global_data");
		const response = await axios.get(apiUrl);
		return NextResponse.json(response.data);
	} catch (error) {
		console.error("Error fetching addresses data:", error);
		return NextResponse.json({ error: "An error occurred while fetching data" }, { status: 500 });
	}
}
