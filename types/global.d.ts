interface Window {
	ethereum?: any;
}

interface UnlockData {
	months: string[];
	amounts: number[];
}

interface Deposit {
	amount: string;
	endTimestamp: number;
	createdTimestamp: number;
	points: number;
	updatedTimestamp?: number | null;
	depositIndex: number;
}

interface DailySnapshot {
	date: string;
	totalPoints: number;
}

interface UserDeposits {
	[user: string]: Deposit[];
}

export interface SecondaryAddressBadge {
	address: string;
	extra: {
		inactive_referrals: number;
	};
	scores: {
		prime_score: number;
		community_score: number;
		initialization_score: number;
	};
	base_scores?: {
		prime_score: number;
		community_score: number;
		initialization_score: number;
	};
	merged_score_data: {
		prime_score: number;
		community_score: number;
		initialization_score: number;
	};
	prime_sunk: number;
	prime_amount_cached: number;
	prime_held_duration: number;
	total_prime_multiplier: number;
	secondary_addresses: string[];
	longest_caching_time: number;
	modifier_boost_by_badge: Record<string, string>;
	held_prime_before_unlock: boolean;
	total_initial_multiplier: number;
	total_community_multiplier: number;
	echelon_governance_participation: number;
	participated_in_prime_unlock_vote: boolean;
	users_referred: number;
	governance_vote_2: boolean;
	governance_vote_3: boolean;
}

export interface UserData {
	avatar_count: number;
	base_prime_amount_cached: number;
	base_scores: {
		prime_score: number;
		community_score: number;
		initialization_score: number;
	};
	echelon_governance_participation: number;
	extra: {
		inactive_referrals: number;
		secondary_address_badges?: SecondaryAddressBadge[];
		primary_address_badge_data?: SecondaryAddressBadge;
	};
	held_prime_before_unlock: boolean;
	longest_caching_time: number;
	participated_in_prime_unlock_vote: boolean;
	percentage: number;
	leaderboard_rank: number;
	prime_amount_cached: number;
	prime_held_duration: number;
	prime_sunk: number;
	secondary_addresses: string[];
	scores: {
		prime_score: number;
		community_score: number;
		initialization_score: number;
	};
	merged_score_data: {
		prime_score: number;
		community_score: number;
		initialization_score: number;
	};
	total_users: number;
	users_referred: number;
}

interface LocalStorageData {
	timestamp: number;
	deposits: UserDeposits;
}

type ModifierByDays = {
	[key: number]: number;
};
