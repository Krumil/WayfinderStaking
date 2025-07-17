import { create } from "zustand";

export interface AddressData {
	address: string;
	data: {
		avatar_count: number;
		users_referred: number;
		merged_boosted_referred_score_data: {
			prime_score: number;
			community_score: number;
			initialization_score: number;
		};
		merged_score_data?: {
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
		percentage: number;
		position: number;
	};
	yesterday_data?: {
		address: string;
		merged_boosted_referred_score_data?: {
			prime_score: number;
			community_score: number;
			initialization_score: number;
		};
		data?: {
			merged_score_data?: {
				prime_score: number;
				community_score: number;
				initialization_score: number;
			};
			merged_boosted_referred_score_data?: {
				prime_score: number;
				community_score: number;
				initialization_score: number;
			};
			prime_amount_cached?: number;
			position?: number;
			percentage?: number;
		};
		prime_amount_cached?: number;
		position?: number;
		percentage?: number;
	};
	changes?: {
		score_change: number;
		position_change: number;
		score_percentage_change: number;
	};
}

interface AddressesState {
	allAddressesData: AddressData[];
	setAllAddressesData: (data: AddressData[] | ((prev: AddressData[]) => AddressData[])) => void;
}

export const useAddressesStore = create<AddressesState>((set) => ({
	allAddressesData: [],
	setAllAddressesData: (data) =>
		set((state) => ({
			allAddressesData: typeof data === "function" ? data(state.allAddressesData) : data,
		})),
}));
