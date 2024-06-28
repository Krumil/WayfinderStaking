import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}"
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
				"gradient-twitter-card": "linear-gradient(45deg, rgba(73,73,73,0.5) 0%, rgba(184, 182, 140, 0.5) 100%)"
			},
			colors: {
				"judge-gray": {
					"50": "#f6f6f0",
					"100": "#e8e8d9",
					"200": "#d2d2b6",
					"300": "#b8b68c",
					"400": "#a39e6c",
					"500": "#958d5d",
					"600": "#7f754f",
					"700": "#675b41",
					"800": "#554b39",
					"900": "#4d4436",
					"950": "#2b251d"
				},
				hampton: {
					"50": "#faf7f0",
					"100": "#f0e8d5",
					"200": "#e0d1aa",
					"300": "#cfb47a",
					"400": "#c39e5c",
					"500": "#b88548",
					"600": "#a26b3d",
					"700": "#885335",
					"800": "#704330",
					"900": "#5d392a",
					"950": "#341d14"
				}
			},
			animation: {
				fade: "fadeIn .5s ease-in-out"
			},

			keyframes: {
				fadeIn: {
					from: { opacity: "0" },
					to: { opacity: "1" }
				}
			},
			animationDuration: {
				"150ms": "150ms",
				"200ms": "200ms",
				"300ms": "300ms",
				"400ms": "400ms",
				"600ms": "600ms",
				"900ms": "900ms"
			},
			animationDelay: {
				"150ms": "150ms",
				"200ms": "200ms",
				"300ms": "300ms",
				"400ms": "400ms",
				"600ms": "600ms",
				"900ms": "900ms"
			}
		}
	},
	daisyui: {
		themes: {
			dark: {
				...require("daisyui/src/theming/themes")["dark"],
				primary: "#e0d1aa"
			}
		}
	},
	plugins: [require("daisyui")]
};
export default config;
