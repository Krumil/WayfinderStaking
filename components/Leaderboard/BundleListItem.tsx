import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { formatNumberWithCommas, isMobile } from '@/lib/utils';
import { BundleListItemProps } from './types';

const BundleListItem = React.memo(({ bundle, addresses, index }: BundleListItemProps) => {
  const bundleAddresses = bundle.addresses.map(addr => 
    addresses.find(item => item.address.toLowerCase() === addr.toLowerCase())
  );

  // Skip rendering if any address doesn't have an ENS name
  if (bundleAddresses.some(addr => !addr?.data?.ens_name)) {
    return null;
  }

  return (
    <Link href={`/address/${bundle.addresses.join(',')}`} className="px-4 mb-4 w-full">
      <motion.div
        className="p-4 border border-judge-gray-700 rounded-lg shadow-sm flex flex-row items-center hover:bg-black/30 hover:scale-[1.02] transition-all duration-200 ease-in-out"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: index * 0.1,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        <div className="ml-4 flex-grow">
          <div className="text-xl text-judge-gray-400">
            {bundleAddresses.map(addr => addr?.data?.ens_name || addr?.address).join(", ")}
          </div>
        </div>
        <div className="text-end text-lg md:text-xl font-bold text-gradient-transparent">
          {formatNumberWithCommas(bundle.totalScore)}{!isMobile && " CS"}
        </div>
      </motion.div>
    </Link>
  );
});

BundleListItem.displayName = 'BundleListItem';
export default BundleListItem; 