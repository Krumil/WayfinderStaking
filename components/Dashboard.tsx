"use client";

import React, { useEffect, useState } from "react";
import CardStack from "@/components/CardStack";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import Loader from "@/components/Loader/Loader";
import toast from "react-hot-toast";
import {
	promptSupply,
	fetchPrimeValue,
	formatNumberWithCommas,
} from "@/lib/utils";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { UserData } from "@/types/global";
import { ArrowUpRightIcon } from "lucide-react";

interface DashboardProps {
	userAddresses: string[];
	userData: UserData | null;
	stakingRewards: number;
	addressList: { address: string; ensName: string | null }[];
	totalUsers: number;
}

const Dashboard = ({
	userAddresses,
	userData,
	stakingRewards,
	addressList,
	totalUsers,
}: DashboardProps) => {
	const [fullyDiluitedValue, setFullyDiluitedValue] = useState<number>(1000);
	const [primePrice, setPrimePrice] = useState<number>(0);
	const [roi, setRoi] = useState<number>(0);
	const [userEarnedPromptTokens, setUserEarnedPromptTokens] = useState<number>(0);
	const [userEarnedPromptTokensInUSD, setUserEarnedPromptTokensInUSD] = useState<number>(0);
	const [userPercentage, setUserPercentage] = useState<string>("0");
	const [userPrimeCached, setUserPrimeCached] = useState<number>(0);
	const [ensNames, setEnsNames] = useState<Record<string, string>>({});
	const [showCopied, setShowCopied] = useState(false);
	const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);

	const isMultipleAddresses = userAddresses.length > 1;

	useEffect(() => {
		const initialize = async () => {
			const value = await fetchPrimeValue();
			setPrimePrice(parseFloat(value));
			setIsInitialized(true);
		};

		initialize();
	}, []);

	useEffect(() => {
		if (!userData || !isInitialized) return;

		const fetchEnsNames = async () => {
			const promises = userAddresses.map(async (address) => {
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
					if (data.ens_name) {
						setEnsNames(prev => ({
							...prev,
							[address.toLowerCase()]: data.ens_name
						}));
					}
				} catch (error) {
					console.error('Error fetching ENS name:', error);
				}
			});

			await Promise.all(promises);
		};

		fetchEnsNames();
	}, [userAddresses, userData, isInitialized]);

	useEffect(() => {
		if (!userData || !isInitialized) return;
		const tokens = (userData.percentage / 100) * stakingRewards;
		setUserPrimeCached(((userData.prime_amount_cached || 0) + (userData.base_prime_amount_cached || 0)) / 1_000_000_000_000_000_000);
		setUserPercentage(userData.percentage.toPrecision(2));
		setUserEarnedPromptTokens(tokens);

		if (fullyDiluitedValue > 0) {
			const fullyDiluitedValueInUSD = fullyDiluitedValue * 1_000_000;
			const promptPrice = fullyDiluitedValueInUSD / promptSupply;
			const stakedValue = userPrimeCached * primePrice;
			const roiValue = ((tokens * promptPrice) / stakedValue) * 100;
			setUserEarnedPromptTokensInUSD(tokens * promptPrice);
			setRoi(roiValue);
		}
	}, [userData, stakingRewards, fullyDiluitedValue, primePrice, userPrimeCached, isInitialized]);

	const handleFdvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFullyDiluitedValue(parseFloat(e.target.value));
	};

	const formatPercentage = (percentage: string) => {
		const float = parseFloat(percentage);
		return float > 0.01 ? float.toFixed(2) : float.toPrecision(2);
	};

	const getOrdinalSymbol = (number: number | undefined) => {
		if (number === undefined) return '';

		const j = number % 10,
			k = number % 100;
		if (j == 1 && k != 11) return "st";
		if (j == 2 && k != 12) return "nd";
		if (j == 3 && k != 13) return "rd";
		return "th";
	};

	const getAddressText = () => {
		return isMultipleAddresses ? "These addresses have" : "This address has";
	};

	const getEarningText = () => {
		return isMultipleAddresses ? "Combined, they are" : "This address is";
	};

	const handleCopyAddress = (address: string) => {
		navigator.clipboard.writeText(address).then(() => {
			setShowCopied(true);
			setTimeout(() => setShowCopied(false), 2000);
		}).catch((error) => {
			console.error('Copy failed:', error);
			toast.error('Failed to copy address. Please try again.');
		});
	};

	const notFoundCard = {
		title: <div>Address Not Found</div>,
		content: (
			<div className="text-sm md:text-base">
				<div className="flex flex-col gap-2 md:gap-4">
					<p>
						This address was not found in the Wayfinder leaderboard. This could be due to:
					</p>
					<ul className="list-disc pl-6 space-y-1">
						<li>Less than 24-48 hours have passed since the first cache</li>
						<li>The address has not staked any $PRIME tokens</li>
					</ul>
					<p className="mt-4 text-judge-gray-400">
						Please ensure you have cached your data and wait at least 24-48 hours for it to appear on the leaderboard.
					</p>
					<a
						href="https://cache.wayfinder.ai"
						target="_blank"
						rel="noopener noreferrer"
						className="text-gradient-transparent hover:opacity-80 transition-opacity mt-4 flex items-center gap-1 z-[60]"
					>
						Go to Wayfinder Cache <ArrowUpRightIcon className="w-5 h-5" />
					</a>
				</div>
			</div>
		),
	};

	const dataCards = [
		{
			title: (
				<div>
					<div onClick={() => handleCopyAddress(userAddresses[0])} className="cursor-pointer z-[60]">
						{ensNames[userAddresses[0].toLowerCase()] || `${userAddresses[0].slice(0, 6)}...${userAddresses[0].slice(-4)}`}
						{userData?.secondary_addresses && userData.secondary_addresses.length > 0 &&
							<span className="text-sm">{` (+ ${userData.secondary_addresses.length} others)`}</span>
						}
					</div>
				</div>
			),
			content: (
				<div className="w-full rounded-lg shadow-sm text-xl md:text-2xl flex flex-col justify-between items-start relative min-h-[200px]">
					<div className="mb-4">
						<div className="w-full">
							{getAddressText()} staked a total of{" "}
							<span className="md:text-3xl text-gradient-transparent">
								<AnimatedNumber value={userPrimeCached || 0} />
							</span>{" "}
							$PRIME, giving a {isMultipleAddresses ? "combined " : ""}Contribution Score of{" "}
							<span className="md:text-3xl text-gradient-transparent">
								<AnimatedNumber value={(userData?.merged_score_data?.prime_score || 0) + (userData?.merged_score_data?.community_score || 0) + (userData?.merged_score_data?.initialization_score || 0)} />
							</span>{" "}
						</div>
					</div>
					<p className="mb-4">
						{getEarningText()} earning{" "}
						<span className="md:text-3xl">
							{formatPercentage(userPercentage)}%{" "}
						</span>
						of the total score, which is{" "}
						<span className="md:text-3xl">
							<AnimatedNumber value={userEarnedPromptTokens} />
						</span>{" "}
						$PROMPT.
					</p>
					<a
						href={`https://cache.wayfinder.ai/cache/account/${userAddresses[0]}`}
						target="_blank"
						rel="noopener noreferrer"
						className="text-xs text-gradient-transparent hover:opacity-80 transition-opacity mt-1 flex items-center gap-1 z-[60] relative mb-10 md:mb-12"
						onClick={(e) => e.stopPropagation()}
					>
						Check account on Wayfinder <ArrowUpRightIcon className="w-4 h-4" />
					</a>
					<div className="absolute -bottom-[20px] w-full flex justify-center items-center px-4 pb-2">
						<div className="text-sm md:text-base bg-transparent text-gradient-transparent">
							<div className="flex justify-end items-baseline text-3xl leading-none">
								<div>{userData?.leaderboard_rank || 0}</div>
								<sup className="text-lg text-gradient-transparent">
									{getOrdinalSymbol(userData?.leaderboard_rank)}
								</sup>
								<span className="text-lg flex items-baseline">/ {formatNumberWithCommas(totalUsers || 0)}</span>
							</div>
						</div>
					</div>

					<TooltipProvider>
						<Tooltip open={showCopied}>
							<TooltipTrigger className="w-full h-full absolute inset-0" />
							<TooltipContent
								side="bottom"
								align="center"
								sideOffset={16}
								alignOffset={16}
								className="bg-judge-gray-800/80 text-white border-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200"
							>
								<p className="text-gradient-transparent text-xs sm:text-sm">Copied!</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			),
		},
		{
			title: <div>ROI</div>,
			content: (
				<div className="text-xl md:text-2xl">
					<div className="flex flex-col md:flex-row items-center md:items-start justify-between my-6">
						<div>Speculative FDV (in millions): </div>
						<input
							type="number"
							value={fullyDiluitedValue}
							onChange={handleFdvChange}
							className="input input-sm !z-[60] mt-6 md:mt-0 !bg-hampton-200 text-md text-judge-gray-800 placeholder-judge-gray-600 w-4/12 md:w-3/12 text-center md:text-right"
						/>
					</div>
					<div>
						The {isMultipleAddresses ? "combined " : ""}
						<span className="text-3xl">
							{formatNumberWithCommas(userEarnedPromptTokens)}{" "}
						</span>
						tokens will be worth{" "}
						<span className="text-gradient-transparent text-3xl">
							<AnimatedNumber value={userEarnedPromptTokensInUSD} />
						</span>{" "}
						$USD, with an average ROI of{" "}
						<span className="text-gradient-transparent text-3xl">
							{roi.toFixed(2)}%
						</span>
					</div>
				</div>
			),
		},
		{
			title: <div>{isMultipleAddresses ? "Addresses Info" : "Address Info"}</div>,
			content: (
				<div className="text-base">
					<div className="flex flex-row items-center justify-between my-2">
						{isMultipleAddresses ? "Total Inactive" : "Inactive"} Referrals:
						<span>
							<AnimatedNumber value={userData?.extra.inactive_referrals || 0} />
						</span>
					</div>
					<div className="flex flex-row items-center justify-between my-2">
						{isMultipleAddresses ? "Total Users" : "Users"} Referred:{" "}
						<span>
							<AnimatedNumber value={userData?.users_referred || 0} />
						</span>
					</div>
					<div className="flex flex-row items-center justify-between my-2">
						{isMultipleAddresses ? "Total Prime" : "Prime"} Held Duration:{" "}
						<span>
							<AnimatedNumber
								value={userData ? userData.prime_held_duration / 86400 : 0}
							/>{" "}
							days
						</span>
					</div>
					<div className="flex flex-row items-center justify-between my-2">
						Longest Caching Time:{" "}
						<span>
							<AnimatedNumber value={userData?.longest_caching_time || 0} />{" "}
							days
						</span>
					</div>
					<div className="flex flex-row items-center justify-between my-2">
						{isMultipleAddresses ? "Total Echelon" : "Echelon"} Governance Participation:{" "}
						<span>
							<AnimatedNumber
								value={userData?.echelon_governance_participation || 0}
							/>
						</span>
					</div>
					<div className="flex flex-row items-center justify-between my-2">
						Held Prime Before Unlock:{" "}
						<span>
							{userData?.held_prime_before_unlock ? "Yes" : "No"}
						</span>
					</div>
					<div className="flex flex-row items-center justify-between my-2">
						Participated in Prime Unlock Vote:{" "}
						<span>
							{userData?.participated_in_prime_unlock_vote ? "Yes" : "No"}
						</span>
					</div>
					<div className="flex flex-row items-center justify-between my-2">
						Avatar Count:{" "}
						<span>
							<AnimatedNumber
								value={userData?.avatar_count || 0}
							/>
						</span>
					</div>
				</div>
			),
		},
		/* {
			title: <div>Badges</div>,
			content: (
				<div className="text-base">
					{(() => {
						if (!userData?.extra?.secondary_address_badges && !userData?.extra?.primary_address_badge_data) {
							return <div className="text-center text-judge-gray-400">No badges found</div>;
						}

						interface Badge {
							name: string;
							image: string;
							addresses: { address: string; multiplier: number }[];
						}

						const BADGE_IMAGES = {
							PRIME_BEFORE_UNLOCK: "wayfinder_assets/badges_webp/prime_pre_unlock.webp",
							PRIME_UNLOCK_VOTE: "wayfinder_assets/badges_webp/staking_max.webp",
							PRIME_HELD_1YEAR: "wayfinder_assets/badges_webp/prime_held_1year.webp",
							ECHELON_GOVERNANCE: "wayfinder_assets/badges_webp/echelon_election_2.webp",
							GOVERNANCE_VOTE_2: "wayfinder_assets/badges_webp/echelon_election_2.webp",
							GOVERNANCE_VOTE_3: "wayfinder_assets/badges_webp/echelon_election_2.webp",
							REFERRER_1: "wayfinder_assets/badges_webp/referred_1.webp",
							REFERRER_5: "wayfinder_assets/badges_webp/referred_5.webp",
							REFERRER_10: "wayfinder_assets/badges_webp/referred_10.webp",
							REFERRER_25: "wayfinder_assets/badges_webp/referred_25.webp",
							REFERRER_50: "wayfinder_assets/badges_webp/referred_50.webp",
							STAKING_30DAYS: "wayfinder_assets/badges_webp/staking_30days.webp",
							STAKING_90DAYS: "wayfinder_assets/badges_webp/staking_90days.webp",
							STAKING_6MON: "wayfinder_assets/badges_webp/staking_6mon.webp",
							STAKING_1YEAR: "wayfinder_assets/badges_webp/staking_1year.webp",
							STAKING_1_5YEAR: "wayfinder_assets/badges_webp/staking_1.5year.webp",
							STAKING_2YEAR: "wayfinder_assets/badges_webp/staking_2year.webp",
							STAKING_2_5YEAR: "wayfinder_assets/badges_webp/staking_2.5year.webp",
							PRIME_HELD_3MON: "wayfinder_assets/badges_webp/prime_held_3mon.webp",
							PRIME_HELD_6MON: "wayfinder_assets/badges_webp/prime_held_6mon.webp",
						};

						const badges: Record<string, Badge> = {};

						const addBadge = (name: string, address: string, multiplier: number, image: string) => {
							if (!badges[name]) {
								badges[name] = { name, image, addresses: [] };
							}
							badges[name].addresses.push({ address, multiplier });
						};

						// Handle primary address badges first
						const primaryBadges = userData.extra.primary_address_badge_data;
						if (primaryBadges) {
							const address = userAddresses[0];
							const addressData = addressList.find(a => a.address.toLowerCase() === address.toLowerCase());
							const displayAddress = addressData?.ensName || address;

							// Check governance participation
							if (primaryBadges.echelon_governance_participation > 0) {
								addBadge("Echelon Governance", displayAddress, 1, BADGE_IMAGES.ECHELON_GOVERNANCE);
							}

							// Check Prime before unlock
							if (primaryBadges.held_prime_before_unlock) {
								addBadge("Prime Before Unlock", displayAddress, 1, BADGE_IMAGES.PRIME_BEFORE_UNLOCK);
							}

							// Check Prime unlock vote
							if (primaryBadges.participated_in_prime_unlock_vote) {
								addBadge("Prime Unlock Vote", displayAddress, 1, BADGE_IMAGES.PRIME_UNLOCK_VOTE);
							}

							// Check Prime held duration
							if (primaryBadges.prime_held_duration > 0) {
								const days = Math.floor(primaryBadges.prime_held_duration / 86400);
								let image = BADGE_IMAGES.STAKING_30DAYS;
								let badgeName = "30 Days";

								if (days >= 900) {
									image = BADGE_IMAGES.STAKING_2_5YEAR;
									badgeName = "900 Days";
								} else if (days >= 720) {
									image = BADGE_IMAGES.STAKING_2YEAR;
									badgeName = "720 Days";
								} else if (days >= 540) {
									image = BADGE_IMAGES.STAKING_1_5YEAR;
									badgeName = "540 Days";
								} else if (days >= 360) {
									image = BADGE_IMAGES.STAKING_1YEAR;
									badgeName = "360 Days";
								} else if (days >= 180) {
									image = BADGE_IMAGES.STAKING_6MON;
									badgeName = "180 Days";
								} else if (days >= 90) {
									image = BADGE_IMAGES.STAKING_90DAYS;
									badgeName = "90 Days";
								} else if (days >= 30) {
									image = BADGE_IMAGES.STAKING_30DAYS;
									badgeName = "30 Days";
								}

								addBadge(badgeName, displayAddress, primaryBadges.total_prime_multiplier, image);
							}

							// Check governance votes
							if (primaryBadges.governance_vote_2) {
								addBadge("Governance Vote 2", displayAddress, 1, BADGE_IMAGES.GOVERNANCE_VOTE_2);
							}
							if (primaryBadges.governance_vote_3) {
								addBadge("Governance Vote 3", displayAddress, 1, BADGE_IMAGES.GOVERNANCE_VOTE_3);
							}

							// Check users referred
							if (primaryBadges.users_referred > 0) {
								const referralBadges = [
									{ threshold: 50, image: BADGE_IMAGES.REFERRER_50, name: "50+ Referrals" },
									{ threshold: 25, image: BADGE_IMAGES.REFERRER_25, name: "25+ Referrals" },
									{ threshold: 10, image: BADGE_IMAGES.REFERRER_10, name: "10+ Referrals" },
									{ threshold: 5, image: BADGE_IMAGES.REFERRER_5, name: "5+ Referrals" },
									{ threshold: 1, image: BADGE_IMAGES.REFERRER_1, name: "1+ Referrals" }
								];

								referralBadges.forEach(badge => {
									if (primaryBadges.users_referred >= badge.threshold) {
										addBadge(badge.name, displayAddress, 1, badge.image);
									}
								});
							}

							// Check longest caching time
							if (primaryBadges.longest_caching_time >= 365) {
								addBadge("1 Year Cache", displayAddress, primaryBadges.total_prime_multiplier, BADGE_IMAGES.PRIME_HELD_1YEAR);
							}
						}

						// Handle secondary address badges
						if (userData?.extra?.secondary_address_badges) {
							userData.extra.secondary_address_badges.forEach((badge, addressIndex) => {
								// Skip the first entry as it's already handled by primary_address_badge_data
								if (addressIndex === 0) return;


								const address = userData?.secondary_addresses?.[addressIndex - 1] || '';
								const addressData = addressList.find(a => a.address.toLowerCase() === address.toLowerCase());
								const displayAddress = addressData?.ensName || address;

								// Check governance participation
								if (badge.echelon_governance_participation > 0) {
									addBadge("Echelon Governance", displayAddress, 1, BADGE_IMAGES.ECHELON_GOVERNANCE);
								}

								// Check Prime before unlock
								if (badge.held_prime_before_unlock) {
									addBadge("Prime Before Unlock", displayAddress, 1, BADGE_IMAGES.PRIME_BEFORE_UNLOCK);
								}

								// Check Prime unlock vote
								if (badge.participated_in_prime_unlock_vote) {
									addBadge("Prime Unlock Vote", displayAddress, 1, BADGE_IMAGES.PRIME_UNLOCK_VOTE);
								}

								// Check Prime held duration
								if (badge.prime_held_duration > 0) {
									const days = Math.floor(badge.prime_held_duration / 86400);
									let image = BADGE_IMAGES.STAKING_30DAYS;
									let badgeName = "30 Days";

									if (days >= 900) {
										image = BADGE_IMAGES.STAKING_2_5YEAR;
										badgeName = "900 Days";
									} else if (days >= 720) {
										image = BADGE_IMAGES.STAKING_2YEAR;
										badgeName = "720 Days";
									} else if (days >= 540) {
										image = BADGE_IMAGES.STAKING_1_5YEAR;
										badgeName = "540 Days";
									} else if (days >= 360) {
										image = BADGE_IMAGES.STAKING_1YEAR;
										badgeName = "360 Days";
									} else if (days >= 180) {
										image = BADGE_IMAGES.STAKING_6MON;
										badgeName = "180 Days";
									} else if (days >= 90) {
										image = BADGE_IMAGES.STAKING_90DAYS;
										badgeName = "90 Days";
									} else if (days >= 30) {
										image = BADGE_IMAGES.STAKING_30DAYS;
										badgeName = "30 Days";
									}

									addBadge(badgeName, displayAddress, badge.total_prime_multiplier, image);
								}

								// Check governance votes
								if (badge.governance_vote_2) {
									addBadge("Governance Vote 2", displayAddress, 1, BADGE_IMAGES.GOVERNANCE_VOTE_2);
								}
								if (badge.governance_vote_3) {
									addBadge("Governance Vote 3", displayAddress, 1, BADGE_IMAGES.GOVERNANCE_VOTE_3);
								}

								// Check users referred
								if (badge.users_referred > 0) {
									const referralBadges = [
										{ threshold: 50, image: BADGE_IMAGES.REFERRER_50, name: "50+ Referrals" },
										{ threshold: 25, image: BADGE_IMAGES.REFERRER_25, name: "25+ Referrals" },
										{ threshold: 10, image: BADGE_IMAGES.REFERRER_10, name: "10+ Referrals" },
										{ threshold: 5, image: BADGE_IMAGES.REFERRER_5, name: "5+ Referrals" },
										{ threshold: 1, image: BADGE_IMAGES.REFERRER_1, name: "1+ Referrals" }
									];

									referralBadges.forEach(badgeConfig => {
										if (badge.users_referred >= badgeConfig.threshold) {
											addBadge(badgeConfig.name, displayAddress, 1, badgeConfig.image);
										}
									});
								}

								// Check longest caching time
								if (badge.longest_caching_time >= 365) {
									addBadge("1 Year Cache", displayAddress, badge.total_prime_multiplier, BADGE_IMAGES.PRIME_HELD_1YEAR);
								}
							});

							if (Object.keys(badges).length === 0) {
								return <div className="text-center text-judge-gray-400">No badges found</div>;
							}

							return (
								<div className="flex flex-col gap-2 md:gap-4">
									<div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
										{Object.values(badges).map((badge) => (
											<div
												key={badge.name}
												className={`p-1.5 rounded-lg bg-judge-gray-800/20 cursor-pointer transition-colors z-[60] ${selectedBadge === badge.name ? 'bg-judge-gray-800/40 ring-1 ring-judge-gray-400/20' : 'hover:bg-judge-gray-800/30'}`}
												onClick={() => setSelectedBadge(badge.name)}
											>
												<div className="flex flex-col items-center text-center">
													<div className="w-8 h-8">
														<img
															src={`https://staticfiles.wayfinder.ai/${badge.image}`}
															alt={badge.name}
															width={32}
															height={32}
															className="w-full h-full object-contain"
														/>
													</div>
												</div>
											</div>
										))}
									</div>
									<div className="h-px bg-judge-gray-800/20" />
									<div className="w-full">
										<div className="text-sm font-medium text-gradient-transparent mb-2">
											{selectedBadge || 'Select a badge'}
										</div>
										{selectedBadge && badges[selectedBadge] && (
											<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
												{badges[selectedBadge].addresses.map((addr) => (
													<div
														key={addr.address}
														className="text-[10px] leading-[14px] text-white p-1 rounded bg-judge-gray-800/10 truncate"
													>
														{addr.address}
														{addr.multiplier !== 1 && (
															<span className="ml-1 text-[8px] text-judge-gray-500">
																({addr.multiplier}x)
															</span>
														)}
													</div>
												))}
											</div>
										)}
									</div>
								</div>
							);
						}
					})()}
				</div>
			),
		}, */
		{
			title: <div>Linked Addresses</div>,
			content: (
				<div className="text-base">
					{addressList.length > 1 ? (
						<div className="grid grid-cols-2 gap-1">
							{addressList.slice(1).map((addressData, index) => (
								<a
									key={index}
									href={`/address/${addressData.address}`}
									className="p-1 rounded-lg bg-judge-gray-800/20 hover:bg-judge-gray-800/40 transition-colors flex items-center justify-between group relative z-[60]"
								>
									<div className="flex items-center w-full gap-2">
										<span className="text-sm font-mono flex-1 truncate">
											<span className="md:hidden">
												{`${addressData.ensName?.slice(0, 4) || addressData.address.slice(0, 4)}...${addressData.ensName?.slice(-4) || addressData.address.slice(-4)}`}
											</span>
											<span className="hidden md:inline">
												{addressData.ensName || `${addressData.address.slice(0, 6)}...${addressData.address.slice(-4)}`}
											</span>
										</span>
										<span className="text-xs hidden md:block text-judge-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
											Show
										</span>
										<ArrowUpRightIcon className="w-4 h-4" />
									</div>
								</a>
							))}
						</div>
					) : (
						<div className="text-center text-judge-gray-400">No linked addresses found</div>
					)}
				</div>
			),
		},
	];

	if (!isInitialized) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loader />
			</div>
		);
	}

	const stackCards = userData ? dataCards : [notFoundCard];

	return (
		<div>
			<div className="flex flex-col h-screen">
				<CardStack cards={stackCards} />
			</div>
		</div>
	);
};

export default Dashboard;