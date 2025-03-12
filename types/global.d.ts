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
	users_referred: number;
	merged_boosted_referred_score_data: {
		prime_score: number;
		community_score: number;
		initialization_score: number;
	};
	longest_caching_time: number;
	prime_amount_cached: number;
	prime_held_duration: number;
	held_prime_before_unlock: boolean;
	participated_in_prime_unlock_vote: boolean;
	echelon_governance_participation: number;
	governance_vote_2: boolean;
	governance_vote_3: boolean;
	prime_sunk: number;
	leaderboard_rank: number;
	avatar_count: number;
	percentage: number;
	position: number;
}

interface LocalStorageData {
	timestamp: number;
	deposits: UserDeposits;
}

type ModifierByDays = {
	[key: number]: number;
};
