import { IBooking } from '@/types/booking.types';
import api from '@/utils/api';
import { parseApiError } from '@/utils/api.utils';

export interface CreateBookingPayload {
	serviceId: string;
	providerId: string;
	scheduledDate: string; // ISO string
	scheduledTime: string; // ISO string
	address: string;
	phone: string;
	notes?: string;
	promoCode?: string;
	duration: number;
	additionalServices: {
		serviceId: string;
		title: string;
		price: number;
		durationHours: number;
	}[];
	priceBreakdown: {
		basePrice: number;
		baseDuration: number;
		extraHours: number;
		additionalServicesTotal: number;
		promoDiscount: number;
		totalAmount: number;
	};
}

export interface BookingResponse {
	success: boolean;
	message: string;
	data: IBooking;
}

class BookingService {
	private readonly BASE_URL = '/bookings';

	// Create a new booking
	async createBooking(payload: CreateBookingPayload): Promise<BookingResponse> {
		const response = await api.post<BookingResponse>(this.BASE_URL, payload);
		return response.data;
	}

	// Get booking by ID
	async getBookingById(bookingId: string): Promise<BookingResponse> {
		const response = await api.get<BookingResponse>(
			`${this.BASE_URL}/${bookingId}`
		);
		return response.data;
	}

	// Get my bookings
	async getMyBookings(params?: {
		status?: string;
		page?: number;
		limit?: number;
	}): Promise<any> {
		const response = await api.get(`${this.BASE_URL}/my-bookings`, {
			params,
		});
		return response.data;
	}

	// Get upcoming bookings
	async getUpcomingBookings(): Promise<any> {
		const response = await api.get(`${this.BASE_URL}/upcoming`);
		return response.data;
	}

	// Get booking history
	async getBookingHistory(): Promise<any> {
		const response = await api.get(`${this.BASE_URL}/history`);
		return response.data;
	}

	// Cancel booking
	async cancelBooking(
		bookingId: string,
		reason: string
	): Promise<BookingResponse> {
		try {
			const response = await api.post<BookingResponse>(
				`${this.BASE_URL}/${bookingId}/cancel`,
				{ reason }
			);
			return response.data;
		} catch (err: unknown) {
			const error = parseApiError(err);
			// now error.message will be your AppError message
			throw new Error(error.message);
		}
	}

	// Update booking status
	async updateBookingStatus(
		bookingId: string,
		status: string
	): Promise<BookingResponse> {
		const response = await api.patch<BookingResponse>(
			`${this.BASE_URL}/${bookingId}/status`,
			{ status }
		);
		return response.data;
	}

	// Add review
	async addReview(
		bookingId: string,
		rating: number,
		comment?: string
	): Promise<BookingResponse> {
		const response = await api.post<BookingResponse>(
			`${this.BASE_URL}/${bookingId}/review`,
			{ rating, comment }
		);
		return response.data;
	}
}

export const bookingService = new BookingService();
