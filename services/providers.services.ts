import { Service } from '@/types/service.types';
import { User } from '@/types/user.types';
import api from '@/utils/api';

/**
 * Get provider profile by ID
 */
export const getServiceProviderById = async (id: string): Promise<User> => {
	const { data } = await api.get(`/providers/${id}`);
	return data.data;
};

/**
 * Get provider listings by provider ID
 **/
export const getProviderListings = async (): Promise<Service[]> => {
	const { data } = await api.get(`/services`);
	return await data.data;
};
