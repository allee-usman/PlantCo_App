// interfaces/provider.types.ts - Service Provider interfaces

export interface ServiceArea {
	city: string;
	state: string;
	zipCodes?: string[];
	radius?: number; // in km
}

export interface ServiceType {
	_id: string;
	name: string;
	description?: string;
	category?: string;
}

export interface User {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	avatar?: { url: string };
	verified?: boolean;
}

export interface ServiceProvider {
	_id: string;
	user: User;
	bio?: string;
	serviceTypes: ServiceType[];
	specializations?: string[];
	hourlyRate: number;
	rating: number;
	totalReviews: number;
	completedJobs: number;
	status: 'available' | 'busy' | 'on_leave';
	experienceYears?: number;
	serviceAreas?: ServiceArea[];
	responseTime?: string; // e.g., "Within 2 hours"
	verified: boolean;
	discount?: number;
	certificates?: string[];
	portfolio?: {
		images: string[];
		description?: string;
	};
	availability?: {
		monday?: { start: string; end: string }[];
		tuesday?: { start: string; end: string }[];
		wednesday?: { start: string; end: string }[];
		thursday?: { start: string; end: string }[];
		friday?: { start: string; end: string }[];
		saturday?: { start: string; end: string }[];
		sunday?: { start: string; end: string }[];
	};
	createdAt: string;
	updatedAt: string;
}

export interface ServiceProviderStats {
	totalBookings: number;
	completedBookings: number;
	cancelledBookings: number;
	averageRating: number;
	totalReviews: number;
	responseRate: number;
	completionRate: number;
	totalEarnings: number;
	ratingDistribution: {
		5: number;
		4: number;
		3: number;
		2: number;
		1: number;
	};
}

export interface Review {
	_id: string;
	customer: {
		_id: string;
		firstName: string;
		lastName: string;
		avatar?: string;
	};
	provider: string;
	rating: number;
	comment?: string;
	images?: string[];
	helpful: number;
	createdAt: string;
}

export interface Booking {
	_id: string;
	customer: string;
	provider: ServiceProvider;
	serviceType: ServiceType;
	scheduledDate: string;
	scheduledTime: string;
	duration: number; // in hours
	status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
	totalAmount: number;
	paymentStatus: 'pending' | 'paid' | 'refunded';
	address: {
		street: string;
		city: string;
		state: string;
		zipCode: string;
		coordinates?: {
			latitude: number;
			longitude: number;
		};
	};
	notes?: string;
	createdAt: string;
	updatedAt: string;
}
