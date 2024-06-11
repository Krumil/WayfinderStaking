"use client";

interface AddressSearchProps {
	addressInput: string;
	setAddressInput: (value: string) => void;
	handleSearch: () => void;
	calculateValidAddress: boolean;
}

const AddressSearch: React.FC<AddressSearchProps> = ({
	addressInput,
	setAddressInput,
	handleSearch,
	calculateValidAddress
}) => {
	return (
		<div className='form-control'>
			<div className='flex flex-col md:flex-row input-group items-center justify-center relative gap-2'>
				<input
					type='text'
					placeholder='Enter address...'
					value={addressInput}
					onChange={e => setAddressInput(e.target.value)}
					className='input w-9/12 md:w-6/12 px-4 !bg-hampton-200 text-judge-gray-800 placeholder-judge-gray-600'
				/>
				<button
					className={
						"w-9/12 md:w-1/12 btn !bg-hampton-200 !bg-opacity-20 !hover:bg-opacity-80 !disabled:opacity-30 !disabled:cursor-not-allowed"
					}
					onClick={handleSearch}
					disabled={calculateValidAddress}>
					Search
				</button>
			</div>
		</div>
	);
};

export default AddressSearch;
