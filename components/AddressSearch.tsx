"use client";

import { useState, useCallback, useMemo } from "react";
import { ethers } from "ethers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import debounce from "lodash/debounce";
import Notification from "@/components/Notification";

interface AddressSearchProps {
	onAddressDetails: (addresses: string[]) => void;
	onSearchPosition: (address: string) => void;
}

const AddressSearch: React.FC<AddressSearchProps> = ({
	onAddressDetails,
	onSearchPosition,
}) => {
	const [addressInput, setAddressInput] = useState<string>("");
	const [isMultipleAddresses, setIsMultipleAddresses] = useState<boolean>(false);

	const isValidAddresses = useMemo(() => {
		const addresses = addressInput.split(',').map((addr: string) => addr.trim());
		setIsMultipleAddresses(addresses.length > 1);
		return addresses.every((addr: string) => ethers.isAddress(addr) || String(addr)?.endsWith?.(".eth"));
	}, [addressInput]);

	const debouncedSetAddressInput = useMemo(
		() => debounce((value: string) => setAddressInput(value), 300),
		[]
	);

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		debouncedSetAddressInput(e.target.value);
	}, [debouncedSetAddressInput]);

	const handleAddressDetails = useCallback(() => {
		if (isValidAddresses) {
			const addresses = addressInput.split(',').map(addr => addr.trim());
			onAddressDetails(addresses);
		}
	}, [isValidAddresses, addressInput, onAddressDetails]);

	const handleSearchPosition = useCallback(() => {
		if (isValidAddresses) {
			onSearchPosition(addressInput.split(',')[0].trim());
		}
	}, [isValidAddresses, addressInput, onSearchPosition]);

	return (
		<div className="form-control w-full px-4 md:max-w-2xl mx-auto">
			<div className="flex flex-col items-center justify-center relative gap-2">
				<div className="relative w-full mb-2">
					<Input
						type="text"
						placeholder="Enter addresses or ENS..."
						onChange={handleInputChange}
						className="w-full pl-10 py-6 text-lg bg-[#0b0f0d] bg-opacity-20 text-judge-gray-200 border-judge-gray-700 placeholder-judge-gray-400"
					/>
					<Search
						className="absolute left-3 top-1/2 transform -translate-y-1/2 text-judge-gray-400 cursor-pointer"
						size={20}
						onClick={handleAddressDetails}
					/>
				</div>
				<div className="flex justify-center mt-2 space-x-4 w-full">
					<Button
						onClick={handleAddressDetails}
						disabled={!isValidAddresses}
						className="bg-[#0b0f0d] bg-opacity-20 text-judge-gray-200 hover:text-judge-green-500 hover:bg-opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
					>
						View Address Details
					</Button>
					<Button
						onClick={handleSearchPosition}
						disabled={!isValidAddresses || isMultipleAddresses}
						className="bg-[#0b0f0d] bg-opacity-20 text-judge-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
					>
						Show Position
					</Button>
				</div>
			</div>
		</div>
	);
};

export default AddressSearch;