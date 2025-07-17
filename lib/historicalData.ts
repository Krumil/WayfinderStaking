import { AddressData } from "@/stores/addresses";
import { formatNumberWithCommas } from "./utils";

/**
 * Checks if an address has historical data
 */
export const hasHistoricalData = (item: AddressData): boolean => {
	return item.yesterday_data !== undefined;
};

/**
 * Gets the current total score from an address item
 */
export const getCurrentScore = (item: AddressData): number => {
	// Handle the case where merged_score_data might exist (old format)
	const oldFormatScores = (item.data as any)?.merged_score_data;
	if (oldFormatScores) {
		return (
			oldFormatScores.prime_score +
			oldFormatScores.community_score +
			oldFormatScores.initialization_score
		);
	}

	// New format
	if (item.data?.merged_boosted_referred_score_data) {
		const scores = item.data.merged_boosted_referred_score_data;
		return (
			scores.prime_score + scores.community_score + scores.initialization_score
		);
	}

	return 0;
};

/**
 * Gets yesterday's total score from an address item
 */
export const getYesterdayScore = (item: AddressData): number | null => {
	if (!item.yesterday_data) return null;

	// Handle the case where merged_score_data might exist (old format)
	const oldFormatScores = (item.yesterday_data.data as any)?.merged_score_data;
	if (oldFormatScores) {
		return (
			oldFormatScores.prime_score +
			oldFormatScores.community_score +
			oldFormatScores.initialization_score
		);
	}

	// New format wrapped in data
	if (item.yesterday_data.data?.merged_boosted_referred_score_data) {
		const scores = item.yesterday_data.data.merged_boosted_referred_score_data;
		return (
			scores.prime_score + scores.community_score + scores.initialization_score
		);
	}

	// New format direct
	if (item.yesterday_data.merged_boosted_referred_score_data) {
		const scores = item.yesterday_data.merged_boosted_referred_score_data;
		return (
			scores.prime_score + scores.community_score + scores.initialization_score
		);
	}

	return 0;
};

/**
 * Gets the current position from an address item
 */
export const getCurrentPosition = (item: AddressData): number => {
	return item.data?.position || item.data?.leaderboard_rank || 0;
};

/**
 * Gets yesterday's position from an address item
 */
export const getYesterdayPosition = (item: AddressData): number | null => {
	if (!item.yesterday_data) return null;

	return (
		item.yesterday_data.data?.position || item.yesterday_data.position || 0
	);
};

/**
 * Gets the current percentage from an address item
 */
export const getCurrentPercentage = (item: AddressData): number => {
	return item.data?.percentage || 0;
};

/**
 * Gets yesterday's percentage from an address item
 */
export const getYesterdayPercentage = (item: AddressData): number | null => {
	if (!item.yesterday_data) return null;

	return (
		item.yesterday_data.data?.percentage || item.yesterday_data.percentage || 0
	);
};

/**
 * Creates a tooltip content for score changes
 */
export const createScoreTooltipContent = (
	item: AddressData
): {
	current: string;
	yesterday: string;
	change: string;
	changePercent: string;
} | null => {
	if (!item.yesterday_data) return null;

	const currentScore = getCurrentScore(item);
	const yesterdayScore = getYesterdayScore(item);

	if (yesterdayScore === null) return null;

	return {
		current: formatNumberWithCommas(currentScore),
		yesterday: formatNumberWithCommas(yesterdayScore),
		change: formatNumberWithCommas(currentScore - yesterdayScore),
		changePercent:
			item.changes?.score_percentage_change.toFixed(2) + "%" || "0%",
	};
};

/**
 * Creates a tooltip content for position changes
 */
export const createPositionTooltipContent = (
	item: AddressData
): { current: number; yesterday: number; change: number } | null => {
	if (!item.yesterday_data) return null;

	const currentPosition = getCurrentPosition(item);
	const yesterdayPosition = getYesterdayPosition(item);

	if (yesterdayPosition === null) return null;

	return {
		current: currentPosition,
		yesterday: yesterdayPosition,
		change: item.changes?.position_change || 0,
	};
};
