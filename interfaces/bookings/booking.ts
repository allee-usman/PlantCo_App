export type TabType = 'all' | 'upcoming' | 'completed' | 'cancelled';

export interface ServiceProvider {
	id: number;
	name: string;
	rating: number;
	ratePerHour: number;
	totalReviews: number;
	profileImage: string;
	phone: string;
	email: string;
}

export interface PaymentMethod {
	id: string;
	type: 'card' | 'paypal' | 'apple_pay' | 'google_pay' | 'bank_transfer';
	displayName: string;
	last4?: string; // For cards
	cardBrand?: 'visa' | 'mastercard' | 'amex' | 'discover';
	icon: string;
}

export interface ServiceDetails {
	description: string;
	equipment: string[];
	instructions: string;
	estimatedCost: number;
	paymentStatus: 'pending' | 'paid' | 'refunded';
}

export interface BookingDetails {
	id: number;
	serviceName: string;
	startTime: string;
	address: string;
	duration: number;
	status: 'upcoming' | 'completed' | 'cancelled';
	remindMe?: boolean;
	notes?: string;
	serviceImage?: string;
	tip?: number;
	taxes?: number;
	discount?: number;
	serviceProvider: ServiceProvider;
	paymentMethod: PaymentMethod;
	serviceDetails: ServiceDetails;
	bookingId?: string;
}
