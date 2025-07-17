import React from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import Loader from '@/components/Loader/Loader';
import AddressListItem from './AddressListItem';
import BundleSection from './BundleSection';
import ScrollToTopButton from './ScrollToTopButton';
import ScrollIndicator from './ScrollIndicator';
import { useLeaderboardState } from './useLeaderboardState';
import { calculateListHeight } from './utils';
import { LeaderboardProps } from './types';

const Leaderboard: React.FC<LeaderboardProps> = ({
  addressesData,
  addressToHighlight,
  showOnlyFavorites,
  onLoadMore,
  isLoadingMore,
  hasMore
}) => {
  const {
    allAddresses,
    favorites,
    bundleItems,
    isNearBottom,
    activeHighlight,
    isInitialLoading,
    listRef,
    scrollToTop,
    toggleFavorite,
    handleScroll,
    filteredAddresses,
    totalItemCount,
  } = useLeaderboardState({
    addressesData,
    addressToHighlight,
    showOnlyFavorites,
    onLoadMore,
    isLoadingMore,
    hasMore
  });

  // Calculate list height based on mode and items
  const listHeight = calculateListHeight(showOnlyFavorites, filteredAddresses.length);

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto relative px-2">
      {showOnlyFavorites && filteredAddresses.length === 0 ? (
        <div className="flex items-start justify-center h-full">
          <p className="text-xl text-judge-gray-400">No favorites added yet</p>
        </div>
      ) : (
        <div>
          <div style={{ height: listHeight }} className="overflow-visible relative">
            <AutoSizer>
              {({ height, width }) => (
                <List
                  ref={listRef}
                  height={height}
                  itemCount={totalItemCount}
                  itemSize={100}
                  width={width}
                  className="no-scrollbar overflow-visible px-0"
                  onScroll={handleScroll}
                  overscanCount={10}
                  style={{ display: 'flex', justifyContent: 'center' }}
                  itemData={{
                    addresses: filteredAddresses,
                    favorites,
                    toggleFavorite,
                    highlightedAddress: activeHighlight
                  }}
                  useIsScrolling
                >
                  {AddressListItem}
                </List>
              )}
            </AutoSizer>
            
            {/* Scroll indicator */}
            {!showOnlyFavorites && !isNearBottom && <ScrollIndicator />}
            
            {/* Scroll to top button */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-4">
              {!showOnlyFavorites && <ScrollToTopButton onClick={scrollToTop} />}
            </div>
          </div>
        </div>
      )}
      
      {/* Bundle section */}
      {showOnlyFavorites && <BundleSection bundleItems={bundleItems} allAddresses={allAddresses} />}
    </div>
  );
};

export default React.memo(Leaderboard); 