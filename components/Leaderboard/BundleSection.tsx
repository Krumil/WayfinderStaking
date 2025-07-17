import React from 'react';
import BundleListItem from './BundleListItem';
import { AddressItem, BundleItem } from './types';

interface BundleSectionProps {
  bundleItems: BundleItem[];
  allAddresses: AddressItem[];
}

const BundleSection: React.FC<BundleSectionProps> = ({ bundleItems, allAddresses }) => {
  return (
    <div className="mt-8 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Bundles</h2>
      {bundleItems.length > 0 ? (
        bundleItems.map((bundle, index) => (
          <BundleListItem
            key={index}
            bundle={bundle}
            addresses={allAddresses}
            index={index}
          />
        ))
      ) : (
        <p className="text-xl text-judge-gray-400">No favorite bundles added yet</p>
      )}
    </div>
  );
};

export default BundleSection; 