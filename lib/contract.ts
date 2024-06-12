import { ethers } from "ethers";
import abi from "./abi.json";
import primeAbi from "./primeAbi.json"; // ABI for the $PRIME token contract

// Replace with your own Infura, Alchemy, or other provider URL
const providerUrl = "https://ethereum-rpc.publicnode.com";
const stakingContractAddress = "0x4a3826bd2e8a31956ad0397a49efde5e0d825238";
const primeTokenAddress = "0xb23d80f5FefcDDaa212212F028021B41DEd428CF";

let provider: ethers.JsonRpcProvider;
let stakingContract: ethers.Contract;
let primeContract: ethers.Contract;

async function initializeContract() {
	provider = new ethers.JsonRpcProvider(providerUrl);
	stakingContract = new ethers.Contract(stakingContractAddress, abi, provider);
	primeContract = new ethers.Contract(primeTokenAddress, primeAbi, provider);
	return { stakingContract, primeContract };
}

async function getLatestBlockNumber() {
	return provider.getBlockNumber();
}

async function getPrimeBalance() {
	const balance = await primeContract.balanceOf(stakingContractAddress);
	return ethers.formatEther(balance);
}

async function getENSNameFromAddress(address: string, truncated = false) {
	const ens = await provider.lookupAddress(address);
	if (ens) {
		return ens;
	} else if (truncated) {
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	} else {
		return address;
	}
}

async function getAddressFromENS(ensName: string) {
	const resolver = await provider.getResolver(ensName);
	if (!resolver) {
		return null;
	}
	const address = await resolver.getAddress();
	return address;
}

export { initializeContract, getLatestBlockNumber, getPrimeBalance, getENSNameFromAddress, getAddressFromENS };
