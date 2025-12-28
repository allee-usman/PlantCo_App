import { Service } from '@/types/service.types';
import { Avatar, ServiceProviderProfile } from '@/types/user.types';
import api from '@/utils/api';
import axios, { AxiosError } from 'axios';

// ---------- Types ----------

export interface ListServicesParams {
	providerId?: string;
	serviceType?: string[] | string;
	active?: boolean;
	minRating?: number;
	tags?: string[] | string;
	page?: number;
	limit?: number;
}

export type ServiceWithPartialProvider = Service & {
	provider: {
		_id: string;
		serviceProviderProfile: ServiceProviderProfile;
		avatar: Avatar;
		name: string;
		email: string;
		phoneNumber: string;
	} | null; // in case service has no provider
};

export interface ListServicesResponse {
	success: boolean;
	data: Service[];
	meta: {
		total: number;
		page: number;
		limit: number;
		pageCount: number;
	};
}

export interface ApiError {
	success: false;
	message: string;
	errors?: Record<string, string[]>;
}

// ---------- Service class ----------

class ServiceProviderService {
	private endpoint = '/services';

	// get active services for provider
	async getActiveServices(
		providerId: string,
		params?: Omit<ListServicesParams, 'provider'>
	): Promise<ListServicesResponse> {
		try {
			const response = await api.get<ListServicesResponse>(this.endpoint, {
				params: {
					providerId,
					active: 'true',
					...this.normalizeParams(params),
				},
			});

			return response.data;
		} catch (error) {
			this.handleError(error);
			throw error;
		}
	}

	// list services (general)
	async listServices(
		params: ListServicesParams = {}
	): Promise<ListServicesResponse> {
		try {
			const response = await api.get<ListServicesResponse>(this.endpoint, {
				params: this.normalizeParams(params),
			});

			return response.data;
		} catch (error) {
			this.handleError(error);
			throw error;
		}
	}

	// get all provider services (active + inactive)
	async getProviderServices(
		providerId: string,
		params?: Omit<ListServicesParams, 'provider'>
	): Promise<ListServicesResponse> {
		try {
			const response = await api.get<ListServicesResponse>(this.endpoint, {
				params: {
					providerId,
					...this.normalizeParams(params),
				},
			});

			return response.data;
		} catch (error) {
			this.handleError(error);
			throw error;
		}
	}

	// get single service
	async getServiceByIdOrSlug(
		idOrSlug: string
	): Promise<ServiceWithPartialProvider> {
		try {
			const response = await api.get<{
				success: boolean;
				data: ServiceWithPartialProvider;
			}>(`${this.endpoint}/${idOrSlug}`);
			return response.data.data;
		} catch (error) {
			this.handleError(error);
			throw error;
		}
	}

	// ---------- helpers ----------

	private normalizeParams(params?: ListServicesParams) {
		if (!params) return {};

		const normalized: any = { ...params };

		if (Array.isArray(params.serviceType)) {
			normalized.serviceType = params.serviceType.join(',');
		}

		if (Array.isArray(params.tags)) {
			normalized.tags = params.tags.join(',');
		}

		if (typeof params.active === 'boolean') {
			normalized.active = params.active ? 'true' : 'false';
		}

		return normalized;
	}

	private handleError(error: unknown): void {
		if (axios.isAxiosError(error)) {
			const err = error as AxiosError<ApiError>;

			if (err.response) {
				console.error('Api Error:', err.response.data);
			} else if (err.request) {
				console.error('Network Error: no response');
			} else {
				console.error('Request Error:', err.message);
			}
		} else {
			console.error('Unexpected error:', error);
		}
	}
}

export const serviceProviderService = new ServiceProviderService();
export default ServiceProviderService;
