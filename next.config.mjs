import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['staticfiles.wayfinder.ai'],
	},
	// Your existing Next.js config options (if any)
};

const config = withPWA({
	dest: 'public',
	register: true,
	skipWaiting: true,
	disable: process.env.NODE_ENV === 'development',
	buildExcludes: [/middleware-manifest\.json$/],
})(nextConfig);

export default config;
