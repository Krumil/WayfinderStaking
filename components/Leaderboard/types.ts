export interface LeaderboardProps {
	addressesData: any[];
	addressToHighlight: string;
	showOnlyFavorites: boolean;
	onLoadMore: () => void;
	isLoadingMore: boolean;
	hasMore: boolean;
}

export interface AddressItem {
	address: string;
	data: any;
	prime_amount_cached?: number;
}

export interface BundleItem {
	addresses: string[];
	totalScore: number;
}

export interface AddressListItemProps {
	index: number;
	style: React.CSSProperties;
	data: {
		addresses: AddressItem[];
		favorites: string[];
		toggleFavorite: (address: string) => void;
		highlightedAddress: string | null;
	};
}

export interface BundleListItemProps {
	bundle: BundleItem;
	addresses: AddressItem[];
	index: number;
}

export interface ScrollProps {
	scrollOffset: number;
	scrollUpdateWasRequested: boolean;
}
