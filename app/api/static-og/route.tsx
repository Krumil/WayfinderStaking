import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
	try {
		// Build the path to your image in the public folder
		const imagePath = path.join(process.cwd(), 'public', 'assets', 'static-og.png');
		const imageBuffer = await fs.readFile(imagePath);
		return new Response(imageBuffer, {
			status: 200,
			headers: {
				'Content-Type': 'image/png',
				'Cache-Control': 'public, max-age=3600, s-maxage=3600',
			},
		});
	} catch (error) {
		console.error('Error reading image file:', error);
		return new Response('Error reading image file', { status: 500 });
	}
}
