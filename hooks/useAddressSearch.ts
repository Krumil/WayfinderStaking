import { useCallback } from "react";
import { toast } from "react-hot-toast";
import { getAddressFromENS } from "@/lib/contract";
import { AddressData } from "@/stores/addresses";

interface UseAddressSearchParams {
	allAddressesData: AddressData[];
	setAllAddressesData: (data: AddressData[]) => void;
	setHighlightAddress: (address: string) => void;
	setCurrentPage: (page: number) => void;
	setTotalPages: (pages: number) => void;
	setHasMore: (hasMore: boolean) => void;
	setLoading: (loading: boolean) => void;
	pageSize: number;
}

export function useAddressSearch({
	allAddressesData,
	setAllAddressesData,
	setHighlightAddress,
	setCurrentPage,
	setTotalPages,
	setHasMore,
	setLoading,
	pageSize
}: UseAddressSearchParams) {
	const searchAddress = useCallback(async (address: string) => {
		try {
			let searchAddr = address;
			if (searchAddr.endsWith(".eth")) {
				const ensAddress = await getAddressFromENS(searchAddr);
				if (ensAddress) {
					searchAddr = ensAddress;
				} else {
					toast.error("Could not resolve ENS name");
					return;
				}
			}

			const normalizedSearchAddress = searchAddr.toLowerCase();
			const foundInLoaded = allAddressesData.find(
				(item: AddressData) => item.address.toLowerCase() === normalizedSearchAddress
			);
			if (foundInLoaded) {
				setHighlightAddress(foundInLoaded.address);
				// Clear highlight after 4 seconds
				setTimeout(() => setHighlightAddress(""), 4000);
				return;
			}

			setLoading(true);
			const res = await fetch(`/api/data/search?query=${searchAddr}`);
			const searchData = await res.json();

			if (searchData.error) {
				toast.error(searchData.error);
				setLoading(false);
				return;
			}

			setAllAddressesData(searchData.addresses as AddressData[]);
			const currentPageNum = Math.floor(searchData.position / pageSize) + 1;
			setCurrentPage(currentPageNum);
			setTotalPages(Math.ceil(searchData.total_addresses / pageSize));
			setHasMore(searchData.next_round_number < searchData.total_addresses);

			const addressToHighlight = (searchData.addresses as AddressData[]).find(
				(item: AddressData) =>
					item.address.toLowerCase() === searchData.resolved_address.toLowerCase()
			)?.address;

			if (addressToHighlight) {
				setTimeout(() => {
					setHighlightAddress(addressToHighlight);
					setLoading(false);
					// Clear highlight after 4 seconds
					setTimeout(() => setHighlightAddress(""), 4000);
				}, 100);
			} else {
				setLoading(false);
			}
		} catch (error) {
			console.error("Error searching address:", error);
			toast.error("Error searching for address");
			setLoading(false);
		}
	}, [allAddressesData, setAllAddressesData, setHighlightAddress, setCurrentPage, setTotalPages, setHasMore, setLoading, pageSize]);

	return { searchAddress };
} 