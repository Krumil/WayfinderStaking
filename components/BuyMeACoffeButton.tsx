"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Image from "next/image";

const BuyMeACoffeeButton = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [customAmount, setCustomAmount] = useState("");
	const [selectedAmount, setSelectedAmount] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => setError(""), 5000);
			return () => clearTimeout(timer);
		}
	}, [error]);

	useEffect(() => {
		if (success) {
			const timer = setTimeout(() => setSuccess(""), 10000);
			return () => clearTimeout(timer);
		}
	}, [success]);

	const handleBuyCoffee = async () => {
		try {
			setLoading(true);
			setError("");
			setSuccess("");

			if (!window.ethereum) {
				throw new Error("MetaMask is not installed");
			}

			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();
			const address = "0x1af5b4ae44c445599e059fabfa5883e591a4ba81";
			const amount = ethers.parseEther(selectedAmount || customAmount);

			const baseChainId = 8453;
			// cast network.chainId to int
			const network = await provider.getNetwork();
			const networkChainId = Number(network.chainId);
			if (networkChainId !== baseChainId) {
				try {
					await window.ethereum.request({
						method: "wallet_switchEthereumChain",
						params: [{ chainId: baseChainId }]
					});
				} catch (switchError: any) {
					// This error code indicates that the chain has not been added to MetaMask
					if (switchError.code === 4902) {
						await window.ethereum.request({
							method: "wallet_addEthereumChain",
							params: [
								{
									chainId: baseChainId,
									chainName: "Base Network",
									rpcUrls: ["https://base-rpc-url"], // Replace with the actual Base network RPC URL
									nativeCurrency: {
										name: "ETH",
										symbol: "ETH",
										decimals: 18
									},
									blockExplorerUrls: ["https://explorer.base-url"] // Replace with the actual Base network block explorer URL
								}
							]
						});
					} else {
						throw switchError;
					}
				}
			}

			const tx = await signer.sendTransaction({
				to: address,
				value: amount
			});

			await tx.wait();
			setSuccess("Thanks for buying me a coffee (joking I will probably buy more $PRIME with this)! 🎉");
			setIsOpen(false);
		} catch (err: any) {
			setError(`Error: ${err.message}`);
		} finally {
			setLoading(false);
		}
	};

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedAmount("");
		setCustomAmount(e.target.value);
	};

	const handlePredefinedAmountClick = (amount: string) => {
		setSelectedAmount(amount);
		setCustomAmount("");
	};

	return (
		<div className='fixed bottom-4 right-4'>
			<button
				className='btn !bg-hampton-200 !btn-circle shadow-lg relative !w-16 !h-16 flex items-center justify-center'
				onClick={() => setIsOpen(true)}>
				<Image src='/assets/coffee.svg' alt='Buy Me a Coffee' width={30} height={30} />
			</button>

			{isOpen && (
				<div className='fixed inset-0 flex items-center justify-center z-50'>
					<div className='modal modal-open'>
						<div className='modal-box !bg-gradient-twitter-card max-w-xl'>
							<div className='font-bold text-lg text-hampton-200'>Buy Me a Coffee (on Base)</div>
							<div className='py-4'>
								<div className='flex space-x-2 mb-2'>
									<button
										className={`btn grow ${
											selectedAmount === "0.001"
												? "!bg-judge-gray-200"
												: "!bg-judge-gray-800 !border-judge-gray-950"
										}`}
										onClick={() => handlePredefinedAmountClick("0.001")}
										disabled={loading}>
										<span
											className={`${
												selectedAmount === "0.001"
													? "text-judge-gray-800"
													: "text-judge-gray-200 !border-judge-gray-950"
											}`}>
											0.001 ETH
										</span>
									</button>
									<button
										className={`btn grow ${
											selectedAmount === "0.01"
												? "!bg-judge-gray-200"
												: "!bg-judge-gray-800 !border-judge-gray-950"
										}`}
										onClick={() => handlePredefinedAmountClick("0.01")}
										disabled={loading}>
										<span
											className={`${
												selectedAmount === "0.01"
													? "text-judge-gray-800"
													: "text-judge-gray-200 !border-judge-gray-950"
											}`}>
											0.01 ETH
										</span>
									</button>
									<button
										className={`btn grow ${
											selectedAmount === "0.1" ? "!bg-judge-gray-200" : "!bg-judge-gray-800"
										}`}
										onClick={() => handlePredefinedAmountClick("0.1")}
										disabled={loading}>
										<span
											className={`${
												selectedAmount === "0.1" ? "text-judge-gray-800" : "text-judge-gray-200"
											}`}>
											0.1 ETH
										</span>
									</button>
								</div>
								<input
									type='number'
									placeholder='Enter custom amount in ETH'
									className='input w-full px-4 !bg-hampton-200 text-judge-gray-800 placeholder-judge-gray-600'
									value={customAmount}
									onChange={handleAmountChange}
									onFocus={() => setSelectedAmount("")}
									disabled={loading}
								/>
							</div>
							<div className='modal-action'>
								<button
									className='btn !bg-judge-gray-200 !text-judge-gray-950 !border-none '
									onClick={() => setIsOpen(false)}>
									Cancel
								</button>
								<button
									className='btn !bg-judge-gray-950 !text-judge-gray-200 !border-none'
									onClick={handleBuyCoffee}
									disabled={loading || (!selectedAmount && !customAmount)}>
									{loading ? "Loading..." : "Confirm"}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
			{error && (
				<div className='alert alert-error shadow-lg mt-4 fixed bottom-4 left-1/2 transform -translate-x-1/2 max-w-md z-60'>
					<div>
						<span>{error}</span>
					</div>
				</div>
			)}
			{success && (
				<div className='alert alert-success shadow-lg mt-4 fixed bottom-4 left-1/2 transform -translate-x-1/2 max-w-md z-60'>
					<div>
						<span>{success}</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default BuyMeACoffeeButton;
