import { ServiceProviderProfile } from './user.types';

// ENUMS
export type BookingStatus =
	| 'pending'
	| 'confirmed'
	| 'in_progress'
	| 'completed'
	| 'cancelled'
	| 'rejected';

export type CancellationBy = 'customer' | 'provider' | 'admin';

export type DiscountType = 'fixed' | 'percentage';

// BASIC REFS YOU MAY POPULATE
export interface ICustomerRef {
	_id: string;
	name: string;
	email: string;
	phone: string;
}

export interface IProviderRef {
	_id: string;
	name: string;
	email: string;
	phone: string;
	serviceProviderProfile: ServiceProviderProfile;
}

export interface IServiceRef {
	_id: string;
	title: string;
	description: string;
	hourlyRate: number;
	durationHours: number;
	image?: { url: string; alt?: string };
}

// ADDITIONAL SERVICES
export interface IAdditionalService {
	serviceId: string;
	title: string;
	price: number;
	durationHours: number;
}

// PRICE BREAKDOWN
export interface IPriceBreakdown {
	basePrice: number;
	baseDuration: number;
	extraHours: number;
	additionalServicesTotal: number;
	promoDiscount: number;
	totalAmount: number;
}

// PROMO
export interface IPromoCode {
	code?: string;
	discountAmount?: number;
	discountType?: DiscountType;
}

// CANCELLATION
export interface ICancellationInfo {
	cancelledAt?: string | Date;
	cancelledBy?: CancellationBy;
	reason?: string;
}

// CUSTOMER REVIEW
export interface ICustomerReview {
	rating?: number;
	comment?: string;
	reviewedAt?: string | Date;
}

// MAIN BOOKING TYPE
export interface IBooking {
	_id: string;

	customer: ICustomerRef;
	provider: IProviderRef;
	service: IServiceRef;

	bookingNumber: string;

	scheduledDate: string | Date;
	scheduledTime: string | Date;
	duration: number;

	address: string;
	phone: string;

	notes?: string;

	status: BookingStatus;

	additionalServices: IAdditionalService[];

	priceBreakdown: IPriceBreakdown;

	promoCode?: IPromoCode;

	cancellation?: ICancellationInfo;

	customerReview?: ICustomerReview;

	// timestamps
	createdAt: string | Date;
	updatedAt: string | Date;

	// virtuals
	totalServiceDuration?: number;
	daysUntilService?: number;
}
