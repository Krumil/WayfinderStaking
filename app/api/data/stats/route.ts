import axios from "axios";
import { NextResponse } from 'next/server';
import { getApiUrl } from "@/lib/utils";

export async function GET() {
	try {
		const apiUrl = getApiUrl("/stats", true);
		console.log('Constructed API URL:', apiUrl);
		const response = await axios.get(apiUrl);
		return NextResponse.json(response.data);

	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to fetch stats data' },
			{ status: 500 }
		);
	}
} 