// types/user.ts

import { Address } from '../types';

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

/** Avatar object */
export interface Avatar {
	url?: string;
	public_id?: string | null;
}

/** Notification settings */
export interface NotificationSettings {
	enableNotifications?: boolean;
	emailAlerts?: boolean;
	customerAlerts?: boolean;
	vendorAlerts?: boolean;
	serviceAlerts?: boolean;
}

/** Recently viewed item inside customerProfile */
export interface RecentlyViewedItem {
	productId: ID;
	viewedAt?: string | Date;
}

/** Customer-specific profile */
export interface CustomerProfile {
	name?: string;
	addresses?: Address[];
	wishlist?: ID[]; // product ids
	recentlyViewed?: RecentlyViewedItem[];
}

/** Vendor profile nested types */
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

/** Vendor-specific profile */
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

/** Service provider nested types */
export interface ServiceArea {
	radius?: number; // miles
	zipCodes?: string[];
	cities?: string[];
	states?: string[];
}

export interface Pricing {
	hourlyRate?: number;
	minimumCharge?: number;
	travelFee?: number;
}

export interface WorkingHours {
	start?: string; // "08:00"
	end?: string; // "18:00"
}

export interface SeasonalAvailability {
	spring?: boolean;
	summer?: boolean;
	fall?: boolean;
	winter?: boolean;
}

export interface ServiceAvailability {
	workingDays?: WeekDay[];
	workingHours?: WorkingHours;
	seasonalAvailability?: SeasonalAvailability;
}

export interface Certification {
	name?: string;
	issuedBy?: string;
	issuedDate?: string | Date;
	expiresAt?: string | Date;
}

export interface Experience {
	yearsInBusiness?: number;
	certifications?: Certification[];
	specializations?: string[];
}

export interface EquipmentItem {
	type?: string;
	brand?: string;
	model?: string;
	year?: number;
}

export interface ServiceStats {
	totalJobs?: number;
	completedJobs?: number;
	averageRating?: number;
	totalReviews?: number;
	responseTime?: number; // avg hours
	completionRate?: number; // percent
}

export interface PortfolioItem {
	title?: string;
	description?: string;
	images?: string[]; // urls
	serviceType?: ServiceType | string;
	completedDate?: string | Date;
}

/** Service provider-specific profile */
export interface ServiceProviderProfile {
	businessName?: string;
	serviceTypes?: ServiceType[];
	serviceArea?: ServiceArea;
	businessLocation?: Address;
	pricing?: Pricing;
	availability?: ServiceAvailability;
	experience?: Experience;
	equipment?: EquipmentItem[];
	stats?: ServiceStats;
	portfolio?: PortfolioItem[];
}

/** Main User interface returned to frontend */
export interface User {
	_id: ID;
	username: string;
	email: string;
	phoneNumber?: string | null;
	// passwordHash intentionally omitted from frontend interface

	role: UserRole;
	status?: UserStatus;
	avatar?: Avatar;
	isVerified?: boolean;

	notificationSettings?: NotificationSettings;

	customerProfile?: CustomerProfile;
	vendorProfile?: VendorProfile;
	serviceProviderProfile?: ServiceProviderProfile;

	// timestamps
	createdAt?: string | Date;
	updatedAt?: string | Date;

	// Virtual: convenience businessName (may be provided by backend)
	businessName?: string | null;
}
