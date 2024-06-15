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

interface LocalStorageData {
	timestamp: number;
	deposits: UserDeposits;
}

type ModifierByDays = {
	[key: number]: number;
};
