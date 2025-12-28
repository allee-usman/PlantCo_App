// services/provider.services.ts - Enhanced version with more features

import { User } from '@/interfaces/interface';
import {
	Booking,
	Review,
	ServiceProvider,
	ServiceProviderStats,
} from '@/types/provider.types';
import api from '@/utils/api';

// -------------------------
//      QUERY TYPES
// -------------------------
export interface ListProvidersQuery {
	page?: number;
	limit?: number;
	serviceTypes?: string[];
	specializations?: string[];
	city?: string;
	state?: string;
	minRating?: number;
	minExperience?: number;
	status?: 'available' | 'on_leave' | 'busy';
	maxHourlyRate?: number;
	sortBy?:
		| 'rating'
		| 'experience'
		| 'hourlyRate'
		| 'completedJobs'
		| 'responseTime'
		| 'newest';
	sortOrder?: 'asc' | 'desc';
	verified?: boolean;
}

export interface NearbyProvidersQuery {
	longitude: number;
	latitude: number;
	maxDistance?: number; // in meters
	serviceTypes?: string[];
	limit?: number;
}

export interface SearchProvidersQuery extends ListProvidersQuery {
	searchTerm?: string;
}

// -------------------------
//      HELPERS
// -------------------------
function normalizeQuery(query: Record<string, any>) {
	const params: any = {};
	Object.keys(query).forEach((key) => {
		const value = query[key];
		if (value === undefined || value === null) return;
		if (Array.isArray(value)) params[key] = value.join(',');
		else params[key] = value;
	});
	return params;
}

// -------------------------
//   SERVICE PROVIDER API
// -------------------------

/**
 * Get all service providers with optional filters
 */
export const getAllServiceProviders = async (
	query?: ListProvidersQuery
): Promise<{
	providers: User[];
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}> => {
	const params = normalizeQuery(query || {});
	const { data } = await api.get('/providers', { params });
	return data.data;
};

/**
 * Search service providers by name, specialization, or service type
 */
export const searchServiceProviders = async (
	query: SearchProvidersQuery
): Promise<{
	providers: ServiceProvider[];
	total: number;
}> => {
	const params = normalizeQuery(query);
	const { data } = await api.get('/providers/search', { params });
	return data;
};

/**
 * Get nearby service providers based on coordinates
 */
export const getNearbyServiceProviders = async (
	query: NearbyProvidersQuery
): Promise<{
	providers: ServiceProvider[];
	total: number;
}> => {
	const params = normalizeQuery(query);
	const { data } = await api.get('/providers/nearby', { params });
	return data;
};

/**
 * Get provider statistics
 */
export const getServiceProviderStats = async (
	id: string
): Promise<ServiceProviderStats> => {
	const { data } = await api.get(`/providers/${id}/stats`);
	return data.stats;
};

/**
 * Get provider reviews
 */
export const getServiceProviderReviews = async (
	id: string,
	page: number = 1,
	limit: number = 10
): Promise<{
	reviews: Review[];
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}> => {
	const { data } = await api.get(`/providers/${id}/reviews`, {
		params: { page, limit },
	});
	return data;
};

/**
 * Get provider availability for a specific date
 */
export const getProviderAvailability = async (
	id: string,
	date: string
): Promise<{
	available: boolean;
	slots: { start: string; end: string }[];
}> => {
	const { data } = await api.get(`/providers/${id}/availability`, {
		params: { date },
	});
	return data;
};

/**
 * Add provider to favorites
 */
export const addProviderToFavorites = async (
	providerId: string
): Promise<{ success: boolean; message: string }> => {
	const { data } = await api.post(`/providers/${providerId}/favorite`);
	return data;
};

/**
 * Remove provider from favorites
 */
export const removeProviderFromFavorites = async (
	providerId: string
): Promise<{ success: boolean; message: string }> => {
	const { data } = await api.delete(`/providers/${providerId}/favorite`);
	return data;
};

/**
 * Create a booking with a service provider
 */
export const createBooking = async (bookingData: {
	providerId: string;
	serviceTypeId: string;
	scheduledDate: string;
	scheduledTime: string;
	duration: number;
	address: {
		street: string;
		city: string;
		state: string;
		zipCode: string;
		coordinates?: { latitude: number; longitude: number };
	};
	notes?: string;
}): Promise<Booking> => {
	const { data } = await api.post('/bookings', bookingData);
	return data.booking;
};

/**
 * Get user's bookings (customer view)
 */
export const getUserBookings = async (
	status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled',
	page: number = 1,
	limit: number = 10
): Promise<{
	bookings: Booking[];
	page: number;
	limit: number;
	total: number;
}> => {
	const params: any = { page, limit };
	if (status) params.status = status;

	const { data } = await api.get('/bookings', { params });
	return data;
};

/**
 * Get featured/recommended providers
 */
export const getFeaturedProviders = async (
	limit: number = 6
): Promise<ServiceProvider[]> => {
	const { data } = await api.get('/providers/featured', {
		params: { limit },
	});
	return data.providers;
};

/**
 * Get providers by category
 */
export const getProvidersByCategory = async (
	categoryId: string,
	query?: ListProvidersQuery
): Promise<{
	providers: ServiceProvider[];
	page: number;
	limit: number;
	total: number;
}> => {
	const params = normalizeQuery(query || {});
	const { data } = await api.get(`/categories/${categoryId}/providers`, {
		params,
	});
	return data;
};

/**
 * Report a service provider
 */
export const reportProvider = async (
	providerId: string,
	reason: string,
	description?: string
): Promise<{ success: boolean; message: string }> => {
	const { data } = await api.post(`/providers/${providerId}/report`, {
		reason,
		description,
	});
	return data;
};

/**
 * Submit a review for a provider
 */
export const submitProviderReview = async (
	providerId: string,
	bookingId: string,
	rating: number,
	comment?: string,
	images?: string[]
): Promise<Review> => {
	const { data } = await api.post(`/providers/${providerId}/reviews`, {
		bookingId,
		rating,
		comment,
		images,
	});
	return data.review;
};
