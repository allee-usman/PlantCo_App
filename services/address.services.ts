import { Address, AddressDTO } from '@/interfaces/types';
import api from '@/utils/api';

export const AddressService = {
	async getAllAddresses(): Promise<Address[]> {
		const { data } = await api.get<{ addresses: Address[] }>('/addresses');
		return data.addresses;
	},
	async getDefaultAddress(): Promise<Address | null> {
		const { data } = await api.get<{ address: Address | null }>(
			'/addresses/default'
		);

		return data.address;
	},

	async getById(id: string): Promise<Address> {
		const { data } = await api.get<{ address: Address }>(`/addresses/${id}`);
		return data.address;
	},

	async create(addressData: AddressDTO): Promise<Address[]> {
		const { data } = await api.post<{ addresses: Address[] }>(
			'/addresses',
			addressData
		);
		return data.addresses;
	},

	async update(id: string, addressData: Partial<AddressDTO>): Promise<Address> {
		const { data } = await api.put<{ address: Address }>(
			`/addresses/${id}`,
			addressData
		);
		return data.address;
	},

	// async update(id: string, addressData: Partial<AddressDTO>): Promise<Address> {
	// 	const { data } = await api.put<{ address: Address }>(
	// 		`/addresses/${id}`,
	// 		addressData
	// 	);
	// 	return data.address;
	// },

	async delete(id: string): Promise<Address[]> {
		const { data } = await api.delete<{ addresses: Address[] }>(
			`/addresses/${id}`
		);
		return data.addresses;
	},

	async setDefault(id: string): Promise<Address[]> {
		const { data } = await api.patch<{ addresses: Address[] }>(
			`/addresses/${id}/default`
		);
		return data.addresses;
	},
};
