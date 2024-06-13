interface Window {
	ethereum?: any;
}

type ModifierByDays = {
	[key: number]: number;
};

interface Deposit {
	amount: string;
	endTimestamp: number;
	createdTimestamp: number;
	points: number;
	updatedTimestamp?: number | null;
}

interface UserDeposits {
	[user: string]: Deposit[];
}

interface LocalStorageData {
	timestamp: number;
	deposits: UserDeposits;
}
