import { useState, useEffect, useRef, useCallback } from "react";
import debounce from "lodash/debounce";
import { FixedSizeList as List } from "react-window";
import { AddressItem, BundleItem } from "./types";
import {
	calculateTotalScoreMultipleAddresses,
	loadFavorites,
	loadBundleFavorites,
	saveFavorites,
} from "./utils";

interface UseLeaderboardStateProps {
	addressesData: any[];
	addressToHighlight: string;
	showOnlyFavorites: boolean;
	onLoadMore: () => void;
	isLoadingMore: boolean;
	hasMore: boolean;
}

export const useLeaderboardState = ({
	addressesData,
	addressToHighlight,
	showOnlyFavorites,
	onLoadMore,
	isLoadingMore,
	hasMore,
}: UseLeaderboardStateProps) => {
	const [allAddresses, setAllAddresses] = useState<AddressItem[]>([]);
	const [favorites, setFavorites] = useState<string[]>([]);
	const [bundleFavorites, setBundleFavorites] = useState<string[][]>([]);
	const [bundleItems, setBundleItems] = useState<BundleItem[]>([]);
	const [isNearBottom, setIsNearBottom] = useState(false);
	const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
	const [isInitialLoading, setIsInitialLoading] = useState(true);

	const listRef = useRef<List>(null);
	const prevScrollOffset = useRef(0);
	const loadingRef = useRef(false);

	// Scroll to top of the list
	const scrollToTop = useCallback(() => {
		if (listRef.current) {
			listRef.current.scrollToItem(0);
		}
	}, []);

	// Toggle favorite address
	const toggleFavorite = useCallback((address: string) => {
		setFavorites((prev) => {
			const newFavorites = prev.includes(address.toLowerCase())
				? prev.filter((fav) => fav !== address.toLowerCase())
				: [...prev, address.toLowerCase()];
			saveFavorites(newFavorites);
			return newFavorites;
		});
	}, []);

	// Load favorites from localStorage on mount
	useEffect(() => {
		setFavorites(loadFavorites());
		setBundleFavorites(loadBundleFavorites());
	}, []);

	// Update addresses when data changes
	useEffect(() => {
		if (addressesData.length > 0) {
			setAllAddresses(addressesData);
			setIsInitialLoading(false);
		} else {
			setIsInitialLoading(false);
		}
	}, [addressesData]);

	// Calculate bundle scores when bundle favorites or addresses change
	useEffect(() => {
		const calculateBundleScores = () => {
			const newBundleItems = bundleFavorites.map((bundle) => {
				const bundleData = bundle
					.map((addr) =>
						addressesData.find(
							(item) => item.address.toLowerCase() === addr.toLowerCase()
						)
					)
					.filter(Boolean);
				const totalScore = calculateTotalScoreMultipleAddresses(bundleData);
				return { addresses: bundle, totalScore };
			});
			setBundleItems(newBundleItems);
		};

		calculateBundleScores();
	}, [bundleFavorites, addressesData]);

	// Scroll to highlighted address
	useEffect(() => {
		if (addressToHighlight && allAddresses.length > 0) {
			const index = allAddresses.findIndex(
				(item) =>
					item.address.toLowerCase() === addressToHighlight.toLowerCase()
			);
			if (index !== -1) {
				setActiveHighlight(addressToHighlight);

				// Try scrolling methods for better reliability
				const scrollToHighlightedAddress = () => {
					if (listRef.current) {
						listRef.current.scrollToItem(index, "center");
					}

					// Retry if listRef is not available yet
					if (!listRef.current) {
						setTimeout(scrollToHighlightedAddress, 100);
					}
				};

				scrollToHighlightedAddress();
			}
		} else {
			setActiveHighlight(null);
		}
	}, [addressToHighlight, allAddresses]);

	// Filter addresses based on favorites
	const filteredAddresses = useCallback(() => {
		return showOnlyFavorites
			? allAddresses.filter((item) =>
					favorites.includes(item.address.toLowerCase())
			  )
			: allAddresses;
	}, [allAddresses, favorites, showOnlyFavorites]);

	// Debounced load more function to prevent multiple calls
	const debouncedLoadMore = useCallback(
		debounce(() => {
			if (!isLoadingMore && !loadingRef.current && hasMore) {
				loadingRef.current = true;
				onLoadMore();
				// Reset loading ref after a delay to prevent multiple calls
				setTimeout(() => {
					loadingRef.current = false;
				}, 1000);
			}
		}, 300),
		[isLoadingMore, hasMore, onLoadMore]
	);

	// Handle scroll events
	const handleScroll = useCallback(
		({
			scrollOffset,
			scrollUpdateWasRequested,
		}: {
			scrollOffset: number;
			scrollUpdateWasRequested: boolean;
		}) => {
			// Skip if this is a programmatic scroll update
			if (scrollUpdateWasRequested) return;

			const scrollingDown = scrollOffset > prevScrollOffset.current;
			prevScrollOffset.current = scrollOffset;

			// Only process scroll events when scrolling down and not in favorites mode
			if (!showOnlyFavorites && scrollingDown && listRef.current) {
				const listElement = (listRef.current as any)
					._outerRef as HTMLDivElement;
				if (!listElement) return;

				const scrolledPercentage =
					(scrollOffset + listElement.clientHeight) / listElement.scrollHeight;
				const nearBottom = scrolledPercentage > 0.8;

				// Only update state if it's changing to avoid unnecessary renders
				if (nearBottom !== isNearBottom) {
					setIsNearBottom(nearBottom);
				}

				// Trigger load more when near bottom
				if (nearBottom && hasMore) {
					debouncedLoadMore();
				}
			}
		},
		[showOnlyFavorites, isNearBottom, hasMore, debouncedLoadMore]
	);

	// Cleanup debounce on unmount
	useEffect(() => {
		return () => {
			debouncedLoadMore.cancel();
		};
	}, [debouncedLoadMore]);

	// Calculate total item count including skeleton items
	const totalItemCount = useCallback(() => {
		const baseCount = filteredAddresses().length;
		// Show skeleton items when near bottom OR when loading more, but only if there's more data to load
		return (isNearBottom || isLoadingMore) && !showOnlyFavorites && hasMore
			? baseCount + 5
			: baseCount;
	}, [
		filteredAddresses,
		isLoadingMore,
		showOnlyFavorites,
		isNearBottom,
		hasMore,
	]);

	return {
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
		filteredAddresses: filteredAddresses(),
		totalItemCount: totalItemCount(),
	};
};
