import { create } from 'zustand';

interface AddressesState {
	allAddressesData: any[];
	setAllAddressesData: (data: any[]) => void;
}

export const useAddressesStore = create<AddressesState>((set) => ({
	allAddressesData: [],
	setAllAddressesData: (data) => set({ allAddressesData: data }),
}));