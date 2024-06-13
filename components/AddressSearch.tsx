"use client";

import { ethers } from "ethers";

interface AddressSearchProps {
	addressInput: string;
	setAddressInput: (value: string) => void;
	handleSearch: () => void;
}

const AddressSearch: React.FC<AddressSearchProps> = ({ addressInput, setAddressInput, handleSearch }) => {
	const isValidAddress =
		addressInput && (ethers.isAddress(addressInput) || (addressInput as string).includes(".eth"));
	return (
		<div className='form-control'>
			<div className='flex flex-col md:flex-row input-group items-center justify-center relative gap-2'>
				<input
					type='text'
					placeholder='Enter address...'
					value={addressInput}
					onChange={e => setAddressInput(e.target.value)}
					className='input w-full md:w-6/12 px-4 !bg-hampton-200 text-judge-gray-800 placeholder-judge-gray-600'
				/>
				<button
					className={
						"w-full md:w-1/12 btn !bg-hampton-200 !bg-opacity-20 !hover:bg-opacity-80 !disabled:opacity-30 !disabled:cursor-not-allowed !text-judge-gray-950"
					}
					onClick={handleSearch}
					disabled={!isValidAddress}>
					Search
				</button>
			</div>
		</div>
	);
};

export default AddressSearch;
