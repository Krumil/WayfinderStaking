import { ethers } from "ethers";
import { isMobile } from "./utils";
import abi from "./abi.json";
import primeAbi from "./primeAbi.json"; // ABI for the $PRIME token contract
import primeAbiBase from "./primeAbiBase.json"; // ABI for the $PRIME token contract
import axios from "axios";

// Replace with your own Infura, Alchemy, or other provider URL
const providerUrl = "https://ethereum-rpc.publicnode.com";
const providerUrlBase = "https://base-rpc.publicnode.com";
const stakingContractAddress = "0x4a3826bd2e8a31956ad0397a49efde5e0d825238";
const stakingContractAddressBase = "0x75a44a70ccb0e886e25084be14bd45af57915451";
const primeTokenAddress = "0xb23d80f5FefcDDaa212212F028021B41DEd428CF";
const primeTokenAddressBase = "0xfA980cEd6895AC314E7dE34Ef1bFAE90a5AdD21b";

let provider: ethers.JsonRpcProvider;
let providerBase: ethers.JsonRpcProvider;
let stakingContract: ethers.Contract;
let stakingContractBase: ethers.Contract;
let primeContract: ethers.Contract;
let primeContractBase: ethers.Contract;

let ensCache: Record<string, string> = {};

async function initializeContract() {
	provider = new ethers.JsonRpcProvider(providerUrl);
	providerBase = new ethers.JsonRpcProvider(providerUrlBase);
	stakingContract = new ethers.Contract(stakingContractAddress, abi, provider);
	stakingContractBase = new ethers.Contract(
		stakingContractAddressBase,
		abi,
		providerBase
	);
	primeContract = new ethers.Contract(primeTokenAddress, primeAbi, provider);
	primeContractBase = new ethers.Contract(
		primeTokenAddressBase,
		primeAbiBase,
		providerBase
	);
	return {
		stakingContract,
		stakingContractBase,
		primeContract,
		primeContractBase,
	};
}

async function getLatestBlockNumber(chain = "mainnet") {
	switch (chain) {
		case "mainnet":
			return provider.getBlockNumber();
		case "base":
			return providerBase.getBlockNumber();
		default:
			return provider.getBlockNumber();
	}
}

async function getPrimeBalance() {
	if (!provider) {
		await initializeContract();
	}
	const balance = await primeContract.balanceOf(stakingContractAddress);
	const balanceBase = await primeContractBase.balanceOf(
		stakingContractAddressBase
	);
	return ethers.formatEther(balance + balanceBase);
}

async function fetchENSList() {
	try {
		if (Object.keys(ensCache).length === 0) {
			const response = await axios.get('/api/data/ens');
			ensCache = response.data;
		}
	} catch (error) {
		console.error("Error fetching ENS list:", error);
	}
}

async function getENSNameFromAddress(address: string, truncated = false) {
	try {
		const response = await fetch('/api/data/ens', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ address }),
		});

		if (!response.ok) {
			throw new Error('Failed to fetch ENS name');
		}

		const data = await response.json();
		const ensName = data.ens_name;

		if (ensName) {
			if (truncated && ensName.length > 20) {
				return `${ensName.slice(0, isMobile ? 4 : 8)}...${ensName.slice(isMobile ? -4 : -8)}`;
			}
			return ensName;
		} else if (truncated) {
			const letters = isMobile ? 4 : 8;
			return `${address.slice(0, letters)}...${address.slice(-letters)}`;
		} else {
			return address;
		}
	} catch (error) {
		console.error('Error fetching ENS name:', error);
		if (truncated) {
			const letters = isMobile ? 4 : 8;
			return `${address.slice(0, letters)}...${address.slice(-letters)}`;
		}
		return address;
	}
}

async function getAddressFromENS(ensName: string, truncated = false) {
	try {
		const response = await fetch('/api/data/ens', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ ens: ensName }),
		});

		if (!response.ok) {
			throw new Error('Failed to fetch address');
		}

		const data = await response.json();
		const address = data.address;

		if (!address) {
			return null;
		}

		if (truncated) {
			return `${address.slice(0, 4)}...${address.slice(-4)}`;
		} else {
			return address;
		}
	} catch (error) {
		console.error('Error fetching address:', error);
		return null;
	}
}

async function fetchLogsInBatches(
	contractAddress: string,
	fromBlock: number,
	toBlock: number,
	batchSize: number
) {
	const allLogs = [];
	for (
		let startBlock = fromBlock;
		startBlock <= toBlock;
		startBlock += batchSize
	) {
		const endBlock = Math.min(startBlock + batchSize - 1, toBlock);
		const filter = {
			address: contractAddress,
			fromBlock: startBlock,
			toBlock: endBlock,
		};
		const logs = await provider.getLogs(filter);
		allLogs.push(...logs);
	}
	return allLogs;
}

async function getInteractingAddresses(
	contractAddress: string,
	fromBlock: number,
	batchSize: number = 10000
): Promise<string[]> {
	if (!provider) {
		await initializeContract();
	}

	const toBlock = await getLatestBlockNumber();
	const logs = await fetchLogsInBatches(
		contractAddress,
		fromBlock,
		toBlock,
		batchSize
	);

	const txHashes = Array.from(new Set(logs.map((log) => log.transactionHash))); // Get unique transaction hashes

	const fetchReceipt = async (txHash: string) => {
		return await provider.getTransactionReceipt(txHash);
	};

	const receipts = await Promise.all(
		txHashes.map((txHash) => fetchReceipt(txHash))
	);

	const addresses = Array.from(
		new Set(
			receipts.map((receipt) => {
				if (!receipt) {
					return null;
				}
				return receipt.from;
			})
		)
	).filter((address) => address !== null) as string[];

	return addresses;
}

async function fetchCacheData(
	addresses: string[],
	retries: number = 3,
	delay: number = 100 // delay in ms between retries
): Promise<{ address: string; data: any | null }[]> {
	const fetchData = async (address: string) => {
		const apiUrl = `https://caching.wayfinder.ai/api/walletstats/${address}?format=json`;
		let attempt = 0;
		while (attempt < retries) {
			try {
				const response = await axios.get(apiUrl);
				return { address, data: response.data };
			} catch (error) {
				attempt++;
				if (attempt === retries) {
					console.error(
						`Failed to fetch cache data for address ${address} after ${retries} attempts`,
						error
					);
					return { address, data: null };
				}
				console.warn(
					`Attempt ${attempt} failed for address ${address}. Retrying in ${delay}ms...`,
					error
				);
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}
	};

	// fetch all data in sequence to avoid rate limiting
	const cacheData = [];
	for (const address of addresses) {
		const data = await fetchData(address);
		cacheData.push(data);
	}

	return cacheData.filter(
		(item): item is { address: string; data: any } => item !== undefined
	);
}
export {
	initializeContract,
	getLatestBlockNumber,
	fetchCacheData,
	getPrimeBalance,
	getENSNameFromAddress,
	getAddressFromENS,
	getInteractingAddresses,
	fetchENSList,
};
