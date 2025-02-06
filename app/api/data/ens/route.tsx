import axios from "axios";
import { NextResponse } from "next/server";
import { getApiUrl } from "@/lib/utils";

export async function GET() {
	try {
		const apiUrl = getApiUrl("/ens", true);
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

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { address, ens } = body;

		let apiUrl;
		if (address) {
			apiUrl = getApiUrl(`/ens/${address}`, true);
		} else if (ens) {
			apiUrl = getApiUrl(`/ens/reverse/${ens}`, true);
		} else {
			return NextResponse.json({ error: "Missing address or ENS" }, { status: 400 });
		}

		const response = await axios.get(apiUrl);
		return NextResponse.json(response.data);
	} catch (error: any) {
		console.error("Error resolving ENS:", error);
		if (error.response?.status === 404) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}
		return NextResponse.json(
			{ error: "An error occurred while resolving ENS" },
			{ status: 500 }
		);
	}
}