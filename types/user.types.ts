// import { ObjectId } from 'mongoose';

import { Address } from '@/interfaces/types';
import { ServiceType } from './service.types';

/* =======================
   Shared / Common Types
======================= */

export type UserRole = 'customer' | 'admin' | 'vendor' | 'service_provider';
export type UserStatus = 'active' | 'disabled' | 'suspended';

export interface Avatar {
	url: string;
	public_id?: string;
}

export interface NotificationSettings {
	enableNotifications: boolean;
	emailAlerts: boolean;
	customerAlerts: boolean;
	vendorAlerts: boolean;
	serviceAlerts: boolean;
}

export interface ProfileCompletion {
	isComplete: boolean;
	percentage: number;
	completedAt?: string;
}

/* -------------------- CUSTOMER PROFILE -------------------- */

export interface RecentlyViewedItem {
	productId: string; // or ObjectId
	viewedAt: string; // ISO date
}

export interface CustomerProfile {
	name?: string;
	addresses: Address[];
	wishlist: string[]; // array of product IDs
	recentlyViewed: RecentlyViewedItem[];
}

/* -------------------- VENDOR PROFILE -------------------- */
export type VendorBusinessType = 'nursery' | 'grower' | 'retailer';
export type VendorSpecialty =
	| 'houseplants'
	| 'outdoor_plants'
	| 'succulents'
	| 'herbs'
	| 'accessories'
	| 'pots'
	| 'tools'
	| 'fertilizers';

export interface VendorStats {
	totalProducts: number;
	totalSales: number;
	averageRating: number;
	totalReviews: number;
}
export interface VendorShipping {
	canShipLive: boolean;
	processingTime: number;
	shippingMethods: string[];
}

export interface VendorSocialAccounts {
	instagram?: string;
	facebook?: string;
	twitter?: string;
	tiktok?: string;
}

export interface VendorProfile {
	businessName?: string;
	businessType?: VendorBusinessType;
	businessLocation?: Address;
	description?: string;
	socialAccounts?: VendorSocialAccounts;
	specialties?: VendorSpecialty[];
	stats: VendorStats;
	shipping: VendorShipping;
}

/* -------------------- SERVICE PROVIDER PROFILE -------------------- */
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type AvailabilityStatus = 'available' | 'on_leave' | 'busy';
export type WeekDay =
	| 'monday'
	| 'tuesday'
	| 'wednesday'
	| 'thursday'
	| 'friday'
	| 'saturday'
	| 'sunday';

export interface GeoLocation {
	type: 'Point';
	coordinates: [number, number]; // [lng, lat]
}

export interface ServiceArea {
	radius: number;
	unit: 'km' | 'miles';
	cities?: string[];
	states?: string[];
}

export interface Pricing {
	hourlyRate?: number;
	travelFee?: number;
}

export interface BusinessLocation {
	address?: Address;
	location?: GeoLocation;
}
export interface WorkingHours {
	start?: string;
	end?: string;
}
export interface Availability {
	status: AvailabilityStatus;
	workingDays: WeekDay[];
	workingHours?: WorkingHours;
}

export interface ServiceStats {
	totalJobs: number;
	completedJobs: number;
	averageRating: number;
	totalReviews: number;
	responseTime: number;
	totalEarnings: number;
	completionRate: number;
}
export interface Certification {
	name: string;
	issuedBy: string;
	issuedDate: string;
	expiresAt?: string;
}

export interface Equipment {
	type: string;
	brand?: string;
	model?: string;
	year?: number;
}

export interface PortfolioItem {
	title?: string;
	description?: string;
	images: string[];
	serviceType: string;
	completedDate?: string;
}

export interface ServiceProviderProfile {
	businessName?: string;
	slogan?: string;
	description?: string;
	businessLocation?: BusinessLocation;
	verificationStatus: VerificationStatus;
	serviceTypes: ServiceType[];
	serviceArea?: ServiceArea;
	pricing?: Pricing;
	availability?: Availability;
	paymentDetails?: {
		stripeAccountId?: string;
		payeeName?: string;
	};
	experience?: {
		yearsInBusiness?: number;
		specializations?: ServiceType[];
	};

	stats?: ServiceStats;
	portfolio?: PortfolioItem[];
}

// export interface User {
// 	_id: string;
// 	username: string;
// 	email: string;
// 	phoneNumber?: string;
// 	role: UserRole;
// 	status: UserStatus;
// 	avatar: Avatar;
// 	isVerified: boolean;
// 	notificationSettings: NotificationSettings;

// 	customerProfile?: CustomerProfile;
// 	vendorProfile?: VendorProfile;
// 	serviceProviderProfile?: ServiceProviderProfile;

// 	createdAt: string;
// 	updatedAt: string;
// 	businessName?: string; // virtual field
// }

export interface User {
	_id: string;

	username: string;
	email: string;
	phoneNumber?: string;
	name?: string;

	role: UserRole;
	status: UserStatus;

	avatar?: Avatar;
	isVerified: boolean;

	notificationSettings: NotificationSettings;
	profileCompletion: ProfileCompletion;

	customerProfile?: CustomerProfile;
	vendorProfile?: VendorProfile;
	serviceProviderProfile?: ServiceProviderProfile;

	businessName?: string; // virtual

	createdAt: string;
	updatedAt: string;
}
