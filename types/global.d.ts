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

interface UserData {
	extra: {
		inactive_referrals: number;
	};
	scores: {
		prime_score: number;
		community_score: number;
		initialization_score: number;
	};
	prime_sunk: number;
	base_scores: {
		prime_score: number;
		community_score: number;
		initialization_score: number;
	};
	users_referred: number;
	prime_amount_cached: number;
	prime_held_duration: number;
	longest_caching_time: number;
	base_prime_amount_cached: number;
	held_prime_before_unlock: boolean;
	echelon_governance_participation: number;
	participated_in_prime_unlock_vote: boolean;
	position: number;
	total_prime_cached: number;
	total_score: number;
	total_users: number;
}

interface LocalStorageData {
	timestamp: number;
	deposits: UserDeposits;
}

type ModifierByDays = {
	[key: number]: number;
};
