import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface AddressData {
    address: string;
    ensName: string | null;
}

interface AnimatedTitleProps {
    addressList: AddressData[];
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ addressList }) => {
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

    const AddressListView = () => (
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
        </div>
    );

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