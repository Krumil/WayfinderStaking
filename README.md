# Wayfinder Staking Dashboard

![Next.js](https://img.shields.io/badge/Next.js-13.0+-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-4.5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A modern web application for tracking staking data for the Wayfinder Protocol.

## Features

- Address search functionality
- Leaderboard with filtering options
- Detailed dashboard for individual addresses
- Support for ENS (Ethereum Name Service)
- Responsive design for various screen sizes
- Dynamic OG image generation for social sharing

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wayfinder-staking.git
   cd wayfinder-staking
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
   NEXT_PUBLIC_BASE_URL=https://wayfinder-staking.vercel.app
   ```

## Usage

Run the development server:

```bash
npm run dev
```

or 

```bash
yarn dev
```

or 

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Next.js 13 app directory
  - `api/`: API routes for data fetching and OG image generation
  - `address/`: Dynamic routes for individual address pages
  - `components/`: Reusable React components
  - `lib/`: Utility functions and contract interactions
  - `stores/`: Global state management (e.g., Zustand stores)
- `public/`: Static assets

## Key Components

- `Dashboard`: Displays detailed staking information for individual addresses
- `Leaderboard`: Shows a ranking of addresses based on their staking performance
- `AddressSearch`: Allows users to search for specific addresses or ENS names

## API Routes

- `/api/data/addresses`: Fetches and processes address data
- `/api/og`: Generates dynamic OG images for social sharing

## Deployment

The project is set up for easy deployment on Vercel. Connect your GitHub repository to Vercel for automatic deployments on each push to the main branch.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)
- [Ethereum Name Service (ENS)](https://ens.domains/)