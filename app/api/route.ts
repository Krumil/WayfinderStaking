import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const response = await axios.get("https://echelon.io/api/supply/");
		const supply = response.data;
		return NextResponse.json(supply);
	} catch (error) {}
}
