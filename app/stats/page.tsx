// "use client";

// import { useQuery } from '@tanstack/react-query';
// import {
// 	AreaChart,
// 	Area,
// 	XAxis,
// 	YAxis,
// 	CartesianGrid,
// 	Tooltip,
// 	ResponsiveContainer,
// 	BarChart,
// 	Bar,
// 	Legend
// } from "recharts";
// import axios from "axios";
// import { format } from "date-fns";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { getApiUrl } from "@/lib/utils";

// interface StatsData {
// 	total_prime_cached: number;
// 	prime_withdrawals: number;
// 	net_prime_cached: number;
// 	unique_cachers: number;
// 	wtd_avg_days_cached: number;
// 	wtd_avg_days_cached_with_extensions: number;
// 	monthly_stats: Record<string, number>;
// 	cumulative_stats: Record<string, number>;
// 	new_cachers_monthly: Record<string, number>;
// 	prime_unlocks_monthly: Record<string, number>;
// }

// const fetchStats = async (): Promise<StatsData> => {
// 	try {
// 		const response = await axios.get(getApiUrl('/data/stats'));
// 		if (!response.data) {
// 			throw new Error('No data received from API');
// 		}
// 		// Validate required properties
// 		const requiredProps = ['monthly_stats', 'cumulative_stats', 'new_cachers_monthly'];
// 		for (const prop of requiredProps) {
// 			if (!response.data[prop]) {
// 				console.warn(`Missing required property: ${prop}`);
// 			}
// 		}
// 		return response.data;
// 	} catch (error) {
// 		console.error('Error fetching stats:', error);
// 		throw error;
// 	}
// };

// export default function StatsPage() {
// 	const { data: stats, isLoading, error } = useQuery({
// 		queryKey: ['stats'],
// 		queryFn: fetchStats,
// 		staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
// 		refetchOnWindowFocus: false // Disable refetching on window focus
// 	});

// 	if (isLoading) {
// 		return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
// 	}

// 	if (error) {
// 		console.error('Query error:', error);
// 		return (
// 			<div className="flex items-center justify-center min-h-screen">
// 				<div className="text-center">
// 					<p className="text-red-500 mb-2">Failed to load statistics</p>
// 					<p className="text-sm text-gray-500">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
// 				</div>
// 			</div>
// 		);
// 	}

// 	if (!stats) {
// 		return <div className="flex items-center justify-center min-h-screen">No statistics data available</div>;
// 	}

// 	const formatNumber = (num: number) => {
// 		return new Intl.NumberFormat('en-US').format(num);
// 	};

// 	const monthlyData = Object.entries(stats.monthly_stats || {}).map(([date, value]) => ({
// 		date: format(new Date(date), 'MMM yyyy'),
// 		value
// 	}));

// 	const cumulativeData = Object.entries(stats.cumulative_stats || {}).map(([date, value]) => ({
// 		date: format(new Date(date), 'MMM yyyy'),
// 		value
// 	}));

// 	const newCachersData = Object.entries(stats.new_cachers_monthly || {}).map(([date, value]) => ({
// 		date: format(new Date(date), 'MMM yyyy'),
// 		value
// 	}));

// 	return (
// 		<div className="container mx-auto p-4 space-y-8">
// 			<h1 className="text-3xl font-bold mb-8">Staking Statistics</h1>

// 			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
// 				<Card>
// 					<CardHeader>
// 						<CardTitle>Total PRIME Cached</CardTitle>
// 					</CardHeader>
// 					<CardContent>
// 						<div className="text-2xl font-bold">{formatNumber(stats.total_prime_cached)}</div>
// 					</CardContent>
// 				</Card>

// 				<Card>
// 					<CardHeader>
// 						<CardTitle>Net PRIME Cached</CardTitle>
// 					</CardHeader>
// 					<CardContent>
// 						<div className="text-2xl font-bold">{formatNumber(stats.net_prime_cached)}</div>
// 					</CardContent>
// 				</Card>

// 				<Card>
// 					<CardHeader>
// 						<CardTitle>Unique Cachers</CardTitle>
// 					</CardHeader>
// 					<CardContent>
// 						<div className="text-2xl font-bold">{formatNumber(stats.unique_cachers)}</div>
// 					</CardContent>
// 				</Card>

// 				<Card>
// 					<CardHeader>
// 						<CardTitle>Avg Days Cached</CardTitle>
// 					</CardHeader>
// 					<CardContent>
// 						<div className="text-2xl font-bold">{stats.wtd_avg_days_cached}</div>
// 					</CardContent>
// 				</Card>
// 			</div>

// 			<div className="space-y-8">
// 				<Card>
// 					<CardHeader>
// 						<CardTitle>Monthly PRIME Cached</CardTitle>
// 					</CardHeader>
// 					<CardContent className="h-[400px]">
// 						<ResponsiveContainer width="100%" height="100%">
// 							<AreaChart data={monthlyData}>
// 								<CartesianGrid strokeDasharray="3 3" />
// 								<XAxis dataKey="date" />
// 								<YAxis />
// 								<Tooltip />
// 								<Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
// 							</AreaChart>
// 						</ResponsiveContainer>
// 					</CardContent>
// 				</Card>

// 				<Card>
// 					<CardHeader>
// 						<CardTitle>Cumulative PRIME Cached</CardTitle>
// 					</CardHeader>
// 					<CardContent className="h-[400px]">
// 						<ResponsiveContainer width="100%" height="100%">
// 							<AreaChart data={cumulativeData}>
// 								<CartesianGrid strokeDasharray="3 3" />
// 								<XAxis dataKey="date" />
// 								<YAxis />
// 								<Tooltip />
// 								<Area type="monotone" dataKey="value" stroke="#82ca9d" fill="#82ca9d" />
// 							</AreaChart>
// 						</ResponsiveContainer>
// 					</CardContent>
// 				</Card>

// 				<Card>
// 					<CardHeader>
// 						<CardTitle>New Cachers Monthly</CardTitle>
// 					</CardHeader>
// 					<CardContent className="h-[400px]">
// 						<ResponsiveContainer width="100%" height="100%">
// 							<BarChart data={newCachersData}>
// 								<CartesianGrid strokeDasharray="3 3" />
// 								<XAxis dataKey="date" />
// 								<YAxis />
// 								<Tooltip />
// 								<Bar dataKey="value" fill="#ffc658" />
// 							</BarChart>
// 						</ResponsiveContainer>
// 					</CardContent>
// 				</Card>
// 			</div>
// 		</div>
// 	);
// } 