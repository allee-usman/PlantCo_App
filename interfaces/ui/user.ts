// types/user.ts

import { Address } from '../types';

// Common types
export type ID = string;

export type UserRole = 'customer' | 'admin' | 'vendor' | 'service_provider';
export type UserStatus = 'active' | 'disabled' | 'suspended';

export type BusinessType = 'nursery' | 'grower' | 'retailer';

export type Specialty =
	| 'houseplants'
	| 'outdoor_plants'
	| 'succulents'
	| 'herbs'
	| 'accessories'
	| 'pots'
	| 'tools'
	| 'fertilizers';

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

export type WeekDay =
	| 'monday'
	| 'tuesday'
	| 'wednesday'
	| 'thursday'
	| 'friday'
	| 'saturday'
	| 'sunday';

/* ---------------------- Avatar ---------------------- */
export interface Avatar {
	url?: string;
	public_id?: string | null;
}

/* ---------------------- Notification settings ---------------------- */
export interface NotificationSettings {
	enableNotifications?: boolean;
	emailAlerts?: boolean;
	customerAlerts?: boolean;
	vendorAlerts?: boolean;
	serviceAlerts?: boolean;
}

/* ---------------------- Customer Profile ---------------------- */
export interface RecentlyViewedItem {
	productId: ID;
	viewedAt?: string | Date;
}

export interface CustomerProfile {
	addresses?: Address[];
	wishlist?: ID[];
	recentlyViewed?: RecentlyViewedItem[];
}

/* ---------------------- Vendor Profile ---------------------- */
export interface VendorStats {
	totalProducts?: number;
	totalSales?: number;
	averageRating?: number;
	totalReviews?: number;
}

export interface VendorShipping {
	canShipLive?: boolean;
	processingTime?: number; // days
	shippingMethods?: string[];
}

export interface SocialAccounts {
	instagram?: string;
	facebook?: string;
	twitter?: string;
	tiktok?: string;
}

export interface VendorProfile {
	businessName?: string;
	businessType?: BusinessType;
	businessLocation?: Address;
	description?: string;
	socialAccounts?: SocialAccounts;
	specialties?: Specialty[];
	stats?: VendorStats;
	shipping?: VendorShipping;
}

/* ---------------------- Service Provider Profile ---------------------- */

// businessLocation.geo
export interface GeoLocation {
	type?: 'Point';
	coordinates?: number[]; // [lng, lat]
}

export interface ServiceProviderBusinessLocation {
	address?: Address;
	location?: GeoLocation;
}

export interface ServiceArea {
	radius?: number;
	unit?: 'km' | 'miles';
	cities?: string[];
	states?: string[];
}

export interface Pricing {
	hourlyRate?: number;
	travelFee?: number;
}

export interface WorkingHours {
	start?: string;
	end?: string;
}

export interface ServiceAvailability {
	status?: 'available' | 'on_leave' | 'busy';
	workingDays?: WeekDay[];
	workingHours?: WorkingHours;
}

export interface Experience {
	yearsInBusiness?: number;
	specializations?: ServiceType[];
}

export interface ServiceStats {
	totalJobs?: number;
	completedJobs?: number;
	averageRating?: number;
	totalReviews?: number;
	responseTime?: number;
	completionRate?: number;
}

export interface PortfolioItem {
	title?: string;
	description?: string;
	images?: string[];
	serviceType?: ServiceType;
	completedDate?: string | Date;
}

export interface ServiceProviderProfile {
	businessName?: string;
	bio?: string;
	businessLocation?: ServiceProviderBusinessLocation;
	serviceTypes?: ServiceType[];
	verificationStatus?: 'pending' | 'verified' | 'rejected';
	serviceArea?: ServiceArea;
	pricing?: Pricing;
	availability?: ServiceAvailability;
	paymentDetails?: {
		stripeAccountId?: string;
		payeeName?: string;
	};
	experience?: Experience;
	stats?: ServiceStats;
	portfolio?: PortfolioItem[];
}

/* ---------------------- Main User Interface ---------------------- */
export interface User {
	_id: ID;

	username: string;
	email: string;
	phoneNumber?: string | null;
	name?: string;

	role: UserRole;
	status?: UserStatus;

	avatar?: Avatar;
	isVerified?: boolean;

	notificationSettings?: NotificationSettings;

	profileCompletion?: {
		isComplete?: boolean;
		percentage?: number;
		completedAt?: string | Date;
	};

	customerProfile?: CustomerProfile;
	vendorProfile?: VendorProfile;
	serviceProviderProfile?: ServiceProviderProfile;

	createdAt?: string | Date;
	updatedAt?: string | Date;

	businessName?: string | null; // provided by backend
}
