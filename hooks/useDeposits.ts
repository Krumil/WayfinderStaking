import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { initializeContract, getLatestBlockNumber } from "@/lib/contract";
import { calculatePoints } from "@/lib/utils";

interface UserDeposits {
	[user: string]: Deposit[];
}

const useDeposits = () => {
	const [allDeposits, setAllDeposits] = useState<UserDeposits>({});
	const [contract, setContract] = useState<ethers.Contract | undefined>(undefined);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const initialize = async () => {
			try {
				const { stakingContract } = await initializeContract();
				setContract(stakingContract);
			} catch (err: any) {
				setError(`Error initializing contract: ${err.message}`);
			}
		};

		initialize();
	}, []);

	useEffect(() => {
		const fetchEventsInBatches = async () => {
			if (contract) {
				try {
					const creationBlock = 20019797;
					const latestBlock = await getLatestBlockNumber();
					const batchSize = 5000; // Adjust batch size to avoid exceeding maximum block range

					const allDeposits: UserDeposits = {};

					for (let startBlock = creationBlock; startBlock <= latestBlock; startBlock += batchSize) {
						const endBlock = Math.min(startBlock + batchSize - 1, latestBlock);

						const depositCreatedFilter = contract.filters.DepositCreated();
						const depositExtendedFilter = contract.filters.DepositExtended();

						const createdEvents = await contract.queryFilter(depositCreatedFilter, startBlock, endBlock);
						const extendedEvents = await contract.queryFilter(depositExtendedFilter, startBlock, endBlock);

						createdEvents.forEach((event: any) => {
							const user = event.args.user.toLowerCase(); // Ensure user address is in lowercase
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
									const newDurationInDays =
										(endTimestamp - deposit.createdTimestamp) / (60 * 60 * 24);
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

					setAllDeposits(allDeposits);
				} catch (err: any) {
					setError(`Error fetching events: ${err.message}`);
				}
			}
		};

		fetchEventsInBatches();
	}, [contract]);

	return { allDeposits, contract, error };
};

export default useDeposits;
