import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { PositionChangeIndicator } from '../ChangeIndicators';
import { formatNumberWithCommas, getOrdinalIndicator, isMobile, truncateText } from '@/lib/utils';
import { hasHistoricalData } from '@/lib/historicalData';
import { AddressListItemProps } from './types';

const AddressListItem = React.memo(({ index, style, data }: AddressListItemProps) => {
  const { addresses, favorites, toggleFavorite, highlightedAddress } = data;
  const isSkeletonItem = index >= addresses.length;
  const skeletonIndex = index - addresses.length;

  // Common container styles for both skeleton and data
  const containerStyles = `p-4 md:pl-10 border rounded-lg shadow-sm cursor-pointer transition-all duration-200 ease-in-out ${
    isSkeletonItem
      ? 'border-judge-gray-700'
      : highlightedAddress?.toLowerCase() === addresses[index].address.toLowerCase()
        ? 'highlight-pulse'
        : 'border-judge-gray-700 group-hover:bg-black/30 group-hover:scale-[1.02]'
  }`;

  return (
    <motion.div
      style={{
        ...style,
        padding: '8px 0',
        width: '100%',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.2,
        delay: isSkeletonItem ? skeletonIndex * 0.05 : 0,
      }}
    >
      <Link
        href={isSkeletonItem ? '#' : `/address/${addresses[index].address}`}
        className="group relative block"
        onClick={e => isSkeletonItem && e.preventDefault()}
      >
        {!isSkeletonItem && hasHistoricalData(addresses[index]) && (
          <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10">
            <PositionChangeIndicator item={addresses[index]} />
          </div>
        )}
        <div
          className={containerStyles}
          data-address={isSkeletonItem ? '' : addresses[index].address}
          id={isSkeletonItem ? '' : `address-${addresses[index].address}`}
        >
          {isSkeletonItem ? (
            <SkeletonContent />
          ) : (
            <AddressContent
              address={addresses[index]}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          )}
        </div>
      </Link>
    </motion.div>
  );
});

const SkeletonContent = () => (
  <div className="flex flex-row items-center">
    <div className="flex items-center space-x-4 flex-grow relative">
      <div className="flex-shrink-0 w-15 h-10 rounded-full bg-judge-gray-700/50 animate-pulse"></div>
      <div className="flex flex-col space-y-2">
        <div className="h-6 w-40 bg-judge-gray-700/50 rounded animate-pulse"></div>
        <div className="h-4 w-32 bg-judge-gray-700/50 rounded animate-pulse"></div>
      </div>
    </div>
    <div className="flex flex-col items-end space-y-2 relative">
      <div className="h-6 w-24 bg-judge-gray-700/50 rounded animate-pulse"></div>
      <div className="h-4 w-20 bg-judge-gray-700/50 rounded animate-pulse"></div>
    </div>
    <div className="ml-4 w-6 h-6 bg-judge-gray-700/50 rounded animate-pulse"></div>
  </div>
);

interface AddressContentProps {
  address: any;
  favorites: string[];
  toggleFavorite: (address: string) => void;
}

const AddressContent = ({ address, favorites, toggleFavorite }: AddressContentProps) => (
  <motion.div
    className="flex flex-row items-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.4,
      ease: [0.2, 0.65, 0.3, 0.9]
    }}
    key={`content-${address.address}`}
  >
    <div className="flex items-center space-x-4 flex-grow relative">
      <div className="flex-shrink-0 w-15 h-10 rounded-full bg-gradient-to-br from-judge-green-500 to-judge-blue-500 flex items-center justify-center">
        <div className="flex items-center">
          <span className="text-lg font-bold text-white">
            {address.data.leaderboard_rank}
            <sup className="text-xs">{getOrdinalIndicator(address.data.leaderboard_rank)}</sup>
          </span>
        </div>
      </div>
      <div className={`flex flex-col ${!address.data.ens_name ? 'justify-center' : ''}`}>
        <div className="text-xl md:text-2xl text-judge-gray-200">
          {address.data.ens_name 
            ? truncateText(address.data.ens_name, isMobile) 
            : `${address.address.slice(0, isMobile ? 4 : 8)}...${address.address.slice(isMobile ? -4 : -8)}`}
        </div>
        {address.data.ens_name && (
          <div className="text-sm text-judge-gray-400 h-[1.25rem]">
            {address.address.slice(0, isMobile ? 4 : 8)}...{address.address.slice(isMobile ? -4 : -8)}
          </div>
        )}
      </div>
    </div>
    <div className="flex flex-col items-end relative">
      <div className="text-end text-lg md:text-xl font-bold text-gradient-transparent flex items-center">
        {formatNumberWithCommas(
          (address.data.merged_boosted_referred_score_data?.prime_score || 0) +
          (address.data.merged_boosted_referred_score_data?.community_score || 0) +
          (address.data.merged_boosted_referred_score_data?.initialization_score || 0)
        )}{!isMobile && " CS"}
      </div>
      {address.prime_amount_cached && (
        <div className="text-judge-gray-200 text-sm md:text-base flex items-center">
          {address.prime_amount_cached.toFixed(2).toLocaleString()} $PRIME
        </div>
      )}
    </div>
    <div
      className="ml-4 cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(address.address);
      }}
    >
      {favorites.includes(address.address.toLowerCase()) ? (
        <Star
          fill="#facc15"
          className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform"
        />
      ) : (
        <Star
          className="w-6 h-6 text-judge-gray-400 group-hover:text-yellow-400 group-hover:scale-110 transition-transform"
        />
      )}
    </div>
  </motion.div>
);

AddressListItem.displayName = 'AddressListItem';
export default AddressListItem; 