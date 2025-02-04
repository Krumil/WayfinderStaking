"use client";

import Dashboard from "@/components/Dashboard";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader/Loader";
import { stakingRewards } from "@/lib/utils";
import { getAddressFromENS, getENSNameFromAddress } from "@/lib/contract";
import { useParams } from "next/navigation";
import { useAddressesStore } from "@/stores/addresses";
import type { UserData, SecondaryAddressBadge } from "@/types/global";

interface Address {
	address: string;
	ensName: string | null;
}

interface ApiResponse {
	prime_amount_cached: number;
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
	const [address, setAddress] = useState<Address | null>(null);
	const [fetchedAddress, setFetchedAddress] = useState<boolean>(false);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [totalUsers, setTotalUsers] = useState<number>(0);
	const [secondaryAddressList, setSecondaryAddressList] = useState<Address[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const { allAddressesData } = useAddressesStore();

	useEffect(() => {
		const fetchAddress = async () => {
			const addressParam = decodeURIComponent(params.address)?.toLowerCase().trim();

			if (addressParam.includes(".eth")) {
				const hexAddress = await getAddressFromENS(addressParam);
				if (hexAddress) {
					setAddress({
						address: hexAddress.toLowerCase(),
						ensName: addressParam.toLowerCase(),
					});
				}
			} else {
				const ensName = await getENSNameFromAddress(addressParam);
				setAddress({
					address: addressParam.toLowerCase(),
					ensName: ensName.toLowerCase() === addressParam.toLowerCase() ? null : ensName.toLowerCase(),
				});
			}
			setFetchedAddress(true);
		};

		fetchAddress();
	}, [params.address]);

	useEffect(() => {
		if (!address) return;

		const fetchUserData = async () => {
			setIsLoading(true);
			// Check cache first
			const cachedData = allAddressesData.find(item =>
				item.address.toLowerCase() === address.address.toLowerCase()
			);

			if (cachedData) {
				setUserData(cachedData.data);
				setTotalUsers(allAddressesData.length);
				setIsLoading(false);
				return;
			}

			try {
				const response = await fetch("/api/data/addresses", {
					method: "POST",
					body: JSON.stringify({ addresses: [address.address] }),
					headers: { "Content-Type": "application/json" },
				});

				if (!response.ok) throw new Error('Failed to fetch address data');

				const data: ApiResponse = await response.json();
				if (data.addresses_found.length > 0) {
					setUserData(data.addresses_found[0].data);
					setTotalUsers(data.total_users);
				} else {
					setUserData(null);
					setTotalUsers(data.total_users);
				}
			} catch (error) {
				console.error('Error fetching user data:', error);
				setUserData(null);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserData();
	}, [address, allAddressesData]);

	useEffect(() => {
		if (!userData?.secondary_addresses) return;

		const fetchSecondaryENS = async () => {
			const addressList = await Promise.all(
				userData.secondary_addresses.map(async (addr) => {
					try {
						const response = await fetch('/api/data/ens', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ address: addr }),
						});
						const data = await response.json();
						return {
							address: addr,
							ensName: data.ens_name || null,
						};
					} catch (error) {
						console.error('Error fetching ENS:', error);
						return { address: addr, ensName: null };
					}
				})
			);
			setSecondaryAddressList(addressList);
		};

		fetchSecondaryENS();
	}, [userData?.secondary_addresses]);

	if (!fetchedAddress || isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loader />
			</div>
		);
	}

	if (!address) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-2">Invalid Address</h1>
					<p className="text-judge-gray-400">The provided address is invalid.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-screen">
			<Dashboard
				userAddresses={[address.address]}
				userData={userData}
				stakingRewards={stakingRewards}
				addressList={[address, ...secondaryAddressList]}
				totalUsers={totalUsers}
			/>
		</div>
	);
};

export default AddressPage;