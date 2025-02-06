import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET() {
	try {
		// Use NEXT_PUBLIC_URL if set, otherwise fallback to deployment URL or localhost
		const baseUrl = process.env.NEXT_PUBLIC_URL ||
			(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

		return new ImageResponse(
			(
				<div
					style={{
						height: '100%',
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: '#030711',
						backgroundImage: `url(${baseUrl}/assets/bg-small.png)`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							gap: '2rem',
						}}
					>
						{/* Logo */}
						<img
							src={`${baseUrl}/assets/wayfinder.svg`}
							alt="Wayfinder Logo"
							width="120"
							height="120"
							style={{ margin: '0 0 1rem 0' }}
						/>

						{/* Title */}
						<div
							style={{
								fontSize: 60,
								fontWeight: 'bold',
								background: 'linear-gradient(to right, #d2d2b6, #7f754f)',

								backgroundClip: 'text',
								color: 'transparent',
								letterSpacing: '-0.02em',
							}}
						>
							Wayfinder Staking Leaderboard
						</div>

						{/* Social */}
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '0.5rem',
								marginTop: '1rem',
							}}
						>
							<img
								src={`${baseUrl}/assets/x-logo.png`}
								alt="Twitter Logo"
								width="32"
								height="32"
							/>
							<div
								style={{
									fontSize: 28,
									color: '#e2e8f0',
								}}
							>
								@Simo1028
							</div>
						</div>
					</div>
				</div>
			),
			{
				width: 1200,
				height: 630,
			}
		)
	} catch (e) {
		console.error('Failed to generate OG image:', e);
		return new Response(`Failed to generate image`, {
			status: 500,
		})
	}
} 