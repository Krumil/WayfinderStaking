import { AddressItem } from "./types";

/**
 * Calculates the total score for multiple addresses
 */
export const calculateTotalScoreMultipleAddresses = (
	addressesData: AddressItem[]
) => {
	const totalScore = addressesData.reduce((acc: number, curr: AddressItem) => {
		const mergedScores = curr.data.merged_boosted_referred_score_data || {
			prime_score: 0,
			community_score: 0,
			initialization_score: 0,
		};
		return (
			acc +
			mergedScores.prime_score +
			mergedScores.community_score +
			mergedScores.initialization_score
		);
	}, 0);
	return totalScore;
};

/**
 * Calculates the total score for a single address
 */
export const calculateTotalScore = (address: AddressItem) => {
	const mergedScores = address.data.merged_boosted_referred_score_data || {
		prime_score: 0,
		community_score: 0,
		initialization_score: 0,
	};
	return (
		mergedScores.prime_score +
		mergedScores.community_score +
		mergedScores.initialization_score
	);
};

/**
 * Loads favorites from localStorage
 */
export const loadFavorites = (): string[] => {
	const storedFavorites = localStorage.getItem("favoriteAddresses");
	return storedFavorites ? JSON.parse(storedFavorites) : [];
};

/**
 * Loads bundle favorites from localStorage
 */
export const loadBundleFavorites = (): string[][] => {
	const storedBundleFavorites = localStorage.getItem("favoriteBundles");
	return storedBundleFavorites ? JSON.parse(storedBundleFavorites) : [];
};

/**
 * Saves favorites to localStorage
 */
export const saveFavorites = (favorites: string[]): void => {
	localStorage.setItem("favoriteAddresses", JSON.stringify(favorites));
};

/**
 * Calculates the appropriate list height based on mode and items
 */
export const calculateListHeight = (
	showOnlyFavorites: boolean,
	filteredAddressesLength: number
): string => {
	if (!showOnlyFavorites) {
		return "calc(60vh - 40px)"; // Show partial item by subtracting 40px from height
	}
	const itemHeight = 100; // Height of each item in pixels
	const calculatedHeight = Math.min(
		filteredAddressesLength * itemHeight,
		window.innerHeight * 0.6
	);
	return `${calculatedHeight}px`;
};
