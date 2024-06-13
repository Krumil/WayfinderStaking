import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { initializeContract, getLatestBlockNumber } from "@/lib/contract";
import { calculatePoints } from "@/lib/utils";

interface Deposit {
	amount: string;
	endTimestamp: number;
	createdTimestamp: number;
	updatedTimestamp: number | null;
	points: number;
}

interface UserDeposits {
	[user: string]: Deposit[];
}

interface LocalStorageData {
	timestamp: number;
	deposits: UserDeposits;
}

const useDeposits = () => {
	const [allDeposits, setAllDeposits] = useState<UserDeposits>({});
	const [contract, setContract] = useState<ethers.Contract | undefined>(undefined);
	const [contractBase, setContractBase] = useState<ethers.Contract | undefined>(undefined);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const savedData = localStorage.getItem("allDeposits");
			if (savedData) {
				const parsedData: LocalStorageData = JSON.parse(savedData);
				const now = Date.now();
				if (now - parsedData.timestamp < 60 * 1000) {
					setAllDeposits(parsedData.deposits);
				}
			}
		}
	}, []);

	useEffect(() => {
		const initialize = async () => {
			try {
				const { stakingContract, stakingContractBase } = await initializeContract();
				setContract(stakingContract);
				setContractBase(stakingContractBase);
			} catch (err: any) {
				setError(`Error initializing contract: ${err.message}`);
			}
		};

		initialize();
	}, []);

	const fetchEventsInBatches = async (
		contract: ethers.Contract | undefined,
		creationBlock = 0,
		chain = "mainnet"
	) => {
		if (contract) {
			try {
				const latestBlock = await getLatestBlockNumber(chain);
				const batchSize = chain === "mainnet" ? 10000 : 10000;
				const maxRetries = 3; // Number of retry attempts

				const allDeposits: UserDeposits = {};

				for (let startBlock = creationBlock; startBlock <= latestBlock; startBlock += batchSize) {
					const endBlock = Math.min(startBlock + batchSize - 1, latestBlock);

					const depositCreatedFilter = contract.filters.DepositCreated();
					const depositExtendedFilter = contract.filters.DepositExtended();

					let createdEvents: any[] = [];
					let extendedEvents: any[] = [];
					let retries = 0;
					let success = false;

					while (retries < maxRetries && !success) {
						try {
							createdEvents = await contract.queryFilter(depositCreatedFilter, startBlock, endBlock);
							extendedEvents = await contract.queryFilter(depositExtendedFilter, startBlock, endBlock);
							success = true;
						} catch (err) {
							retries += 1;
							await new Promise(resolve => setTimeout(resolve, 1000));
							if (retries >= maxRetries) {
								throw new Error(
									`Failed to fetch events for blocks ${startBlock} to ${endBlock} after ${maxRetries} attempts`
								);
							}
						}
					}

					createdEvents.forEach((event: any) => {
						const user = event.args.user.toLowerCase();
						const amount = ethers.formatEther(event.args.amount);
						const endTimestamp = Number(event.args.endTimestamp) * 1000;
						const createdTimestamp = Number(event.args.createdTimestamp) * 1000;

						if (!allDeposits[user]) {
							allDeposits[user] = [];
						}

						allDeposits[user].push({
							amount,
							endTimestamp,
							createdTimestamp,
							updatedTimestamp: null,
							points: 0
						});
					});

					extendedEvents.forEach((event: any) => {
						const user = event.args.user.toLowerCase(); // Ensure user address is in lowercase
						const endTimestamp = Number(event.args.endTimestamp) * 1000;
						const updatedTimestamp = Number(event.args.updatedTimestamp) * 1000;

						if (allDeposits[user]) {
							const deposit = allDeposits[user].find(d => d.endTimestamp === updatedTimestamp);
							if (deposit) {
								deposit.endTimestamp = endTimestamp;
							}
						}
					});
				}

				Object.keys(allDeposits).forEach(user => {
					allDeposits[user].forEach(deposit => {
						const points = calculatePoints(deposit);
						deposit.points = points;
					});
				});

				return allDeposits;
			} catch (err: any) {
				setError(`Error fetching events: ${err.message}`);
			}
		}
		return {};
	};

	useEffect(() => {
		const fetchAllDeposits = async () => {
			if (!contract || !contractBase) return;
			const creationBlock = 20019797;
			const creationBlockBase = 15628915;
			const depositsFromContract = await fetchEventsInBatches(contract, creationBlock);
			const depositsFromBaseContract = await fetchEventsInBatches(contractBase, creationBlockBase, "base");

			const mergedDeposits: UserDeposits = { ...depositsFromContract };
			Object.keys(depositsFromBaseContract).forEach(user => {
				if (!mergedDeposits[user]) {
					mergedDeposits[user] = depositsFromBaseContract[user];
				} else {
					mergedDeposits[user] = mergedDeposits[user].concat(depositsFromBaseContract[user]);
				}
			});

			setAllDeposits(mergedDeposits);

			// Save to localStorage with a timestamp
			if (typeof window !== "undefined") {
				const now = Date.now();
				const localStorageData: LocalStorageData = {
					timestamp: now,
					deposits: mergedDeposits
				};
				localStorage.setItem("allDeposits", JSON.stringify(localStorageData));
			}
		};

		if (Object.keys(allDeposits).length === 0) {
			fetchAllDeposits();
		}
	}, [contract, contractBase, allDeposits]);

	return { allDeposits, contract, contractBase, error };
};

export default useDeposits;
