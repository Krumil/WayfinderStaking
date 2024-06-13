import { ethers } from "ethers";
import abi from "./abi.json";
import primeAbi from "./primeAbi.json"; // ABI for the $PRIME token contract
import primeAbiBase from "./primeAbiBase.json"; // ABI for the $PRIME token contract

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

async function initializeContract() {
	provider = new ethers.JsonRpcProvider(providerUrl);
	providerBase = new ethers.JsonRpcProvider(providerUrlBase);
	stakingContract = new ethers.Contract(stakingContractAddress, abi, provider);
	stakingContractBase = new ethers.Contract(stakingContractAddressBase, abi, providerBase);
	primeContract = new ethers.Contract(primeTokenAddress, primeAbi, provider);
	primeContractBase = new ethers.Contract(primeTokenAddressBase, primeAbiBase, providerBase);
	return { stakingContract, stakingContractBase, primeContract, primeContractBase };
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
	const balance = await primeContract.balanceOf(stakingContractAddress);
	const balanceBase = await primeContractBase.balanceOf(stakingContractAddressBase);
	return ethers.formatEther(balance + balanceBase);
}

async function getENSNameFromAddress(address: string, truncated = false) {
	// check if provider is initialized
	if (!provider) {
		await initializeContract();
	}
	const ens = await provider.lookupAddress(address);
	if (ens) {
		return ens;
	} else if (truncated) {
		return `${address.slice(0, 4)}...${address.slice(-4)}`;
	} else {
		return address;
	}
}

async function getAddressFromENS(ensName: string, truncated = false) {
	if (!provider) {
		await initializeContract();
	}
	const resolver = await provider.getResolver(ensName);
	if (!resolver) {
		return null;
	}
	const address = await resolver.getAddress();

	if (!address) {
		return null;
	}

	if (truncated) {
		return `${address.slice(0, 4)}...${address.slice(-4)}`;
	} else {
		return address;
	}
}

export { initializeContract, getLatestBlockNumber, getPrimeBalance, getENSNameFromAddress, getAddressFromENS };
