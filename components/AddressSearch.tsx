"use client";

import { useState, useCallback, useMemo } from "react";
import { ethers } from "ethers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import debounce from "lodash/debounce";

interface AddressSearchProps {
	onAddressDetails: (addresses: string[]) => void;
	onSearchPosition: (address: string) => void;
}

const AddressSearch: React.FC<AddressSearchProps> = ({
	onAddressDetails,
	onSearchPosition,
}) => {
	const [addressInput, setAddressInput] = useState<string>("");

	const isValidAddress = useMemo(() => {
		const trimmedAddress = addressInput.trim();
		return trimmedAddress && (ethers.isAddress(trimmedAddress) || String(trimmedAddress)?.endsWith?.(".eth"));
	}, [addressInput]);

	const debouncedSetAddressInput = useMemo(
		() => debounce((value: string) => setAddressInput(value), 300),
		[]
	);

	const handleAddressInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		debouncedSetAddressInput(e.target.value);
	}, [debouncedSetAddressInput]);

	const handleAddressDetails = useCallback(() => {
		if (isValidAddress) {
			onAddressDetails([addressInput.trim()]);
		}
	}, [isValidAddress, addressInput, onAddressDetails]);

	const handleSearchPosition = useCallback(() => {
		if (isValidAddress) {
			onSearchPosition(addressInput.trim());
		}
	}, [isValidAddress, addressInput, onSearchPosition]);

	return (
		<div className="form-control w-full px-4 md:max-w-2xl mx-auto">
			<div className="flex flex-col items-center justify-center relative gap-4">
				<div className="relative w-full">
					<Input
						type="text"
						placeholder="Enter an address or ENS..."
						onChange={handleAddressInputChange}
						className="w-full pl-10 py-6 text-lg bg-[#0b0f0d] bg-opacity-20 text-judge-gray-200 border-judge-gray-700 placeholder-judge-gray-400"
					/>
					<Search
						className="absolute left-3 top-1/2 transform -translate-y-1/2 text-judge-gray-400 cursor-pointer"
						size={20}
						onClick={handleAddressDetails}
					/>
				</div>
				<div className="flex justify-between w-full gap-4">
					<Button
						onClick={handleAddressDetails}
						disabled={!isValidAddress}
						className="flex-1 bg-[#0b0f0d] bg-opacity-20 text-judge-gray-200 hover:text-judge-green-500 hover:bg-opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
					>
						View Address Details
					</Button>
					<Button
						onClick={handleSearchPosition}
						disabled={!isValidAddress}
						className="flex-1 bg-[#0b0f0d] bg-opacity-20 text-judge-gray-200 hover:text-judge-green-500 hover:bg-opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
					>
						Show Position
					</Button>
				</div>
			</div>
		</div>
	);
};

export default AddressSearch;