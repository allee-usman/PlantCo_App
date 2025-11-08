// import { ObjectId } from 'mongoose';

import { Address } from '@/interfaces/types';

export interface Avatar {
	url: string;
	public_id?: string;
}

// export interface NotificationSettings {
// 	enableNotifications: boolean;
// 	emailAlerts: boolean;
// 	customerAlerts: boolean;
// 	vendorAlerts: boolean;
// 	serviceAlerts: boolean;
// }

export interface NotificationSettings {
	enableNotifications: boolean;
	emailAlerts: boolean;
	orderAlerts: boolean;
	generalAlerts: boolean;
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
	businessType?: 'nursery' | 'grower' | 'retailer';
	businessLocation?: Address;
	description?: string;
	socialAccounts?: VendorSocialAccounts;
	specialties: VendorSpecialty[];
	stats: VendorStats;
	shipping: VendorShipping;
}

/* -------------------- SERVICE PROVIDER PROFILE -------------------- */

export type ServiceType =
	| 'landscaping'
	| 'lawn_mowing'
	| 'garden_design'
	| 'tree_trimming'
	| 'irrigation_installation'
	| 'pest_control'
	| 'fertilization'
	| 'seasonal_cleanup'
	| 'plant_care'
	| 'consultation';

export interface SeasonalAvailability {
	spring: boolean;
	summer: boolean;
	fall: boolean;
	winter: boolean;
}

export interface Availability {
	workingDays: string[];
	workingHours: {
		start: string;
		end: string;
	};
	seasonalAvailability: SeasonalAvailability;
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

export interface ServiceStats {
	totalJobs: number;
	completedJobs: number;
	averageRating: number;
	totalReviews: number;
	responseTime: number;
	completionRate: number;
}

export interface PortfolioItem {
	title: string;
	description?: string;
	images?: string[];
	serviceType?: string;
	completedDate?: string;
}

export interface ServiceProviderProfile {
	businessName?: string;
	serviceTypes: ServiceType[];
	serviceArea: {
		radius: number;
		zipCodes?: string[];
		cities?: string[];
		states?: string[];
	};
	businessLocation?: Address;
	pricing?: {
		hourlyRate?: number;
		minimumCharge?: number;
		travelFee?: number;
	};
	availability: Availability;
	experience?: {
		yearsInBusiness?: number;
		certifications?: Certification[];
		specializations?: string[];
	};
	equipment?: Equipment[];
	stats: ServiceStats;
	portfolio?: PortfolioItem[];
}

/* -------------------- USER CORE -------------------- */

export type UserRole = 'customer' | 'admin' | 'vendor' | 'service_provider';
export type UserStatus = 'active' | 'disabled' | 'suspended';

export interface User {
	_id: string;
	username: string;
	email: string;
	phoneNumber?: string;
	role: UserRole;
	status: UserStatus;
	avatar: Avatar;
	isVerified: boolean;
	notificationSettings: NotificationSettings;

	customerProfile?: CustomerProfile;
	vendorProfile?: VendorProfile;
	serviceProviderProfile?: ServiceProviderProfile;

	createdAt: string;
	updatedAt: string;
	businessName?: string; // virtual field
}
