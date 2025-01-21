import { create } from 'zustand';

export interface AddressData {
	address: string;
	data: {
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
		total_prime_cached: number;
		total_score: number;
		total_users: number;
		users_referred: number;
	};
}

interface AddressesState {
	allAddressesData: AddressData[];
	setAllAddressesData: (data: AddressData[] | ((prev: AddressData[]) => AddressData[])) => void;
}

export const useAddressesStore = create<AddressesState>((set) => ({
	allAddressesData: [],
	setAllAddressesData: (data) => set((state) => ({
		allAddressesData: typeof data === 'function' ? data(state.allAddressesData) : data
	})),
}));