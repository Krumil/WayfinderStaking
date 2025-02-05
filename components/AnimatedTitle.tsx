import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from 'next/link';
import { isMobile } from "@/lib/utils";

interface AddressData {
	address: string;
	ensName: string | null;
}

interface AnimatedTitleProps {
	addressList: AddressData[];
	linkedAddresses: string[];
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ addressList, linkedAddresses }) => {
	const [favoriteSingleAddresses, setFavoriteSingleAddresses] = useState<string[]>([]);
	const [favoriteBundles, setFavoriteBundles] = useState<string[][]>([]);

	useEffect(() => {
		const storedSingleAddresses = localStorage.getItem('favoriteAddresses');
		const storedBundles = localStorage.getItem('favoriteBundles');

		if (storedSingleAddresses) {
			setFavoriteSingleAddresses(JSON.parse(storedSingleAddresses));
		}
		if (storedBundles) {
			setFavoriteBundles(JSON.parse(storedBundles));
		}
	}, []);

	const isFavorite = useCallback(() => {
		if (addressList.length > 1) {
			return favoriteBundles.some(bundle =>
				bundle.length === addressList.length &&
				bundle.every(addr => addressList.some(item => item.address.toLowerCase() === addr.toLowerCase()))
			);
		}
		return favoriteSingleAddresses.includes(addressList[0].address.toLowerCase());
	}, [favoriteBundles, favoriteSingleAddresses, addressList]);

	const toggleFavorite = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		if (addressList.length > 1) {
			setFavoriteBundles(prev => {
				const bundleAddresses = addressList.map(item => item.address.toLowerCase());
				const bundleIndex = prev.findIndex(bundle =>
					bundle.length === bundleAddresses.length &&
					bundle.every(addr => bundleAddresses.includes(addr))
				);

				let newFavorites;
				if (bundleIndex !== -1) {
					newFavorites = prev.filter((_, index) => index !== bundleIndex);
				} else {
					newFavorites = [...prev, bundleAddresses];
				}

				localStorage.setItem('favoriteBundles', JSON.stringify(newFavorites));
				return newFavorites;
			});
		} else {
			const address = addressList[0].address.toLowerCase();
			setFavoriteSingleAddresses(prev => {
				const newFavorites = prev.includes(address)
					? prev.filter(fav => fav !== address)
					: [...prev, address];
				localStorage.setItem('favoriteAddresses', JSON.stringify(newFavorites));
				return newFavorites;
			});
		}
	}, [addressList]);

	const AddressListView = () => {
		const allAddresses = addressList.map(a => a.address);
		const allAddressesWithLinked = Array.from(new Set([...allAddresses, ...linkedAddresses.filter(addr => !allAddresses.includes(addr.toLowerCase()))]));
		const addressesParam = allAddressesWithLinked.join(',');
		const showLink = linkedAddresses.length > 0 && JSON.stringify(allAddresses) !== JSON.stringify(allAddressesWithLinked);

		return (
			<div className="flex flex-wrap">
				{addressList.length > 3 ? (
					<div className="text-lg md:text-4xl text-gradient-transparent rounded-md">
						{`${addressList.length} addresses`}
					</div>
				) : (
					addressList.map((addressData, index) => (
						<div key={addressData.address} className="text-lg md:text-4xl text-gradient-transparent rounded-md">
							{addressData.ensName || `${addressData.address.slice(0, 6)}...${addressData.address.slice(-4)}`}
							{index !== addressList.length - 1 && " /\u00A0"}
						</div>
					))
				)}
				{showLink && (
					<Popover>
						<PopoverTrigger asChild>
							<div className="flex items-center justify-center ml-2 -mt-1">
								<Info
									className="w-5 h-5 md:w-6 md:h-6 text-judge-gray-200 cursor-pointer hover:text-judge-gray-200 transition-colors duration-200"
								/>
							</div>
						</PopoverTrigger>
						<PopoverContent side={isMobile ? "top" : "right"} className="w-64 py-2 bg-black bg-opacity-50 rounded-md shadow-xl">
							<div className="p-2 text-sm text-judge-gray-200">
								This {addressList.length > 1 ? 'group has' : 'wallet has'} linked addresses.
								<Link href={`/address/${addressesParam}`} className="pl-1 text-gradient-transparent">
									Click here
								</Link> to include them in the calculation.
							</div>
						</PopoverContent>
					</Popover>
				)}
			</div>
		);
	}

	const FavoriteButton = () => (
		<motion.div
			whileTap={{ scale: 0.9 }}
			onClick={toggleFavorite}
			className="cursor-pointer mt-[2px] md:mt-2"
		>
			{isFavorite() ? (
				<Star
					fill="#facc15"
					className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 transition-all duration-300 ease-out scale-110 opacity-100"
				/>
			) : (
				<Star
					className="w-5 h-5 md:w-6 md:h-6 text-judge-gray-400 transition-all duration-300 ease-out scale-100 opacity-100 hover:scale-110"
				/>
			)}
		</motion.div>
	);

	return (
		<div className="z-50 w-full">
			<div className="flex items-start justify-between">
				<div className="flex-grow">
					<AddressListView />
				</div>
				<FavoriteButton />
			</div>
		</div>
	);
};

export default AnimatedTitle;