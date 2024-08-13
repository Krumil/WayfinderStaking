"use client";

import Dashboard from "@/components/Dashboard";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader/Loader";
import { stakingRewards } from "@/lib/utils";
import { getAddressFromENS, getENSNameFromAddress, fetchENSList } from "@/lib/contract";
import { useParams } from "next/navigation";
import { useAddressesStore } from "@/stores/addresses";

interface Address {
	address: string;
	ensName: string | null;
}

interface ApiResponse {
	total_score: number;
	total_prime_cached: number;
	position: number;
	total_users: number;
	addresses_processed: number;
	addresses_found: AddressInfo[];
	addresses_not_found: number;
}

interface AddressInfo {
	address: string;
	data: UserData;
}

const AddressPage = () => {
	const params = useParams<{ address: string }>();
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [fetchedAddresses, setFetchedAddresses] = useState<boolean>(false);
	const [combinedUserData, setCombinedUserData] = useState<UserData | null>(null);
	const { allAddressesData } = useAddressesStore();

	useEffect(() => {
		fetchENSList();
	}, []);

	useEffect(() => {
		const fetchAddresses = async () => {
			const addressParams = decodeURIComponent(params.address)?.toLowerCase().split(',').map(a => a.trim());
			const fetchedAddresses: Address[] = [];

			for (const addressParam of addressParams) {
				if (addressParam.includes(".eth")) {
					const hexAddress = await getAddressFromENS(addressParam);
					if (hexAddress) {
						fetchedAddresses.push({
							address: hexAddress.toLowerCase(),
							ensName: addressParam.toLowerCase(),
						});
					}
				} else {
					const ensName = await getENSNameFromAddress(addressParam);

					fetchedAddresses.push({
						address: addressParam.toLowerCase(),
						ensName: ensName.toLowerCase() === addressParam.toLowerCase() ? null : ensName.toLowerCase(),
					});
				}
			}

			setAddresses(fetchedAddresses);
			setFetchedAddresses(true);
		};

		fetchAddresses();
	}, [params.address]);

	useEffect(() => {
		if (addresses.length === 0) return;

		const fetchUserData = async () => {
			// Check if data exists in the store
			if (allAddressesData.length > 0) {
				const relevantData = allAddressesData.filter((item: { address: string; }) =>
					addresses.some(addr => addr.address.toLowerCase() === item.address.toLowerCase())
				);

				if (relevantData.length === addresses.length) {
					// All required data is in the store, use it
					processCombinedData(relevantData, allAddressesData.length - addresses.length + 1);
					return;
				}
			}

			// If data is not in the store or incomplete, fetch it
			const response = await fetch("/api/data/addresses", {
				method: "POST",
				body: JSON.stringify({ addresses: addresses.map(a => a.address) }),
				headers: { "Content-Type": "application/json" },
			});
			const data: ApiResponse = await response.json();
			processCombinedData(data.addresses_found, data.total_users, data.position);
		};

		const processCombinedData = (addressInfos: AddressInfo[], totalUsers: number, position?: number) => {
			const combinedData: UserData = {
				avatar_count: 0,
				base_prime_amount_cached: 0,
				base_scores: { prime_score: 0, community_score: 0, initialization_score: 0 },
				echelon_governance_participation: 0,
				extra: { inactive_referrals: 0 },
				held_prime_before_unlock: false,
				longest_caching_time: 0,
				participated_in_prime_unlock_vote: false,
				percentage: 0,
				position: position || 0,
				prime_amount_cached: 0,
				prime_held_duration: 0,
				prime_sunk: 0,
				scores: { prime_score: 0, community_score: 0, initialization_score: 0 },
				total_prime_cached: 0,
				total_score: 0,
				total_users: totalUsers,
				users_referred: 0
			};

			for (const addressInfo of addressInfos) {
				const userData = addressInfo.data;
				// Sum all numeric fields
				combinedData.avatar_count += userData.avatar_count || 0;
				combinedData.base_prime_amount_cached += userData.base_prime_amount_cached || 0;
				combinedData.base_scores.community_score += userData.base_scores?.community_score || 0;
				combinedData.base_scores.initialization_score += userData.base_scores?.initialization_score || 0;
				combinedData.base_scores.prime_score += userData.base_scores?.prime_score || 0;
				combinedData.echelon_governance_participation += userData.echelon_governance_participation || 0;
				combinedData.extra.inactive_referrals += userData.extra?.inactive_referrals || 0;
				combinedData.longest_caching_time = Math.max(combinedData.longest_caching_time, userData.longest_caching_time || 0);
				combinedData.percentage += userData.percentage || 0;
				combinedData.prime_amount_cached += userData.prime_amount_cached || 0;
				combinedData.prime_held_duration += userData.prime_held_duration || 0;
				combinedData.prime_sunk += userData.prime_sunk || 0;
				combinedData.scores.community_score += userData.scores?.community_score || 0;
				combinedData.scores.initialization_score += userData.scores?.initialization_score || 0;
				combinedData.scores.prime_score += userData.scores?.prime_score || 0;
				combinedData.total_prime_cached += (userData.prime_amount_cached || 0) + (userData.base_prime_amount_cached || 0);
				combinedData.total_score += userData.total_score || 0;
				combinedData.users_referred += userData.users_referred || 0;

				// Handle boolean fields with OR operation
				combinedData.held_prime_before_unlock = combinedData.held_prime_before_unlock || userData.held_prime_before_unlock || false;
				combinedData.participated_in_prime_unlock_vote = combinedData.participated_in_prime_unlock_vote || userData.participated_in_prime_unlock_vote || false;
			}

			if (allAddressesData.length > 0) {
				const position = allAddressesData.findIndex(addressInfo =>
					addressInfo.data.total_score <= combinedData.total_score
				);
				combinedData.position = position === -1 ? allAddressesData.length : position + 1;
			}

			setCombinedUserData(combinedData);
		};

		fetchUserData();
	}, [addresses, allAddressesData]);


	return (
		<div>
			{fetchedAddresses &&
				stakingRewards !== 0 &&
				combinedUserData ? (
				<div className="flex flex-col h-screen">
					<Dashboard
						userAddresses={addresses.map(a => a.address)}
						userData={combinedUserData}
						stakingRewards={stakingRewards}
						addressList={addresses}
					/>
				</div>
			) : (
				<div className="flex justify-center items-center h-screen">
					<Loader />
				</div>
			)}
		</div>
	);
};

export default AddressPage;