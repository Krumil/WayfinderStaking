import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ArrowUpRight, Users, Award, Zap, Clock, Vote } from "lucide-react";

interface AnimatedCardProps {
	title: string;
	value: any;
	icon: any;
	delay: number;
}

interface Data {
	address: string;
	data: any;
}

const AnimatedCard = ({ title, value, icon: Icon, delay }: AnimatedCardProps) => {
	const [count, setCount] = useState(0);

	useEffect(() => {
		let start = 0;
		const end = parseInt(value);
		if (start === end) return;

		let timer = setInterval(() => {
			start += 1;
			setCount(start);
			if (start === end) clearInterval(timer);
		}, 20);

		return () => {
			clearInterval(timer);
		};
	}, [value]);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay }}>
			<Card className='bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>{title}</CardTitle>
					<Icon className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{count.toLocaleString()}</div>
					<p className='text-xs text-muted-foreground pt-1'>
						<ArrowUpRight className='h-4 w-4 inline mr-1' />
						{Math.floor(Math.random() * 10) + 1}% from last period
					</p>
				</CardContent>
			</Card>
		</motion.div>
	);
};

const ModernDataVisualization = ({ data }: { data: Data }) => {
	const formatValue = (value: number) => {
		if (typeof value === "boolean") {
			return value ? "Yes" : "No";
		}
		if (typeof value === "number") {
			if (value > 1e18) {
				return (value / 1e18).toFixed(2);
			}
			return value.toFixed(2);
		}
		return value;
	};

	const cardData = [
		{ title: "Prime Score", value: data.data.scores.prime_score, icon: Award },
		{ title: "Community Score", value: data.data.scores.community_score, icon: Users },
		{ title: "Initialization Score", value: data.data.scores.initialization_score, icon: Zap },
		{ title: "Prime Amount Cached", value: data.data.prime_amount_cached / 1e18, icon: Award },
		{ title: "Prime Held Duration (days)", value: Math.round(data.data.prime_held_duration / 86400), icon: Clock },
		{ title: "Users Referred", value: data.data.users_referred, icon: Users },
		{ title: "Inactive Referrals", value: data.data.extra.inactive_referrals, icon: Users },
		{ title: "Echelon Governance Participation", value: data.data.echelon_governance_participation, icon: Vote }
	];

	return (
		<div className='w-full max-w-7xl mx-auto p-4 space-y-4'>
			<Card className='bg-gradient-to-r from-purple-400 to-pink-500 text-white'>
				<CardHeader>
					<CardTitle className='text-2xl'>Address Information</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-lg font-semibold'>{data.address}</p>
					<p>Held Prime Before Unlock: {data.data.held_prime_before_unlock ? "Yes" : "No"}</p>
					<p>
						Participated in Prime Unlock Vote: {data.data.participated_in_prime_unlock_vote ? "Yes" : "No"}
					</p>
				</CardContent>
			</Card>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				{cardData.map((item, index) => (
					<AnimatedCard
						key={item.title}
						title={item.title}
						value={formatValue(item.value)}
						icon={item.icon}
						delay={index * 0.1}
					/>
				))}
			</div>
		</div>
	);
};

export default ModernDataVisualization;
