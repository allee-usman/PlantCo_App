import { User } from '@/types/user.types';
import { ImageSourcePropType } from 'react-native';

export interface Transaction {
	id: string;
	title: string;
	amount: number;
	date: string;
	type: 'credit' | 'debit';
	category?: string;
	description?: string;
}

export interface ShippingOption {
	id: string;
	type: string;
	priceLabel: string;
	deliveryRange?: string;
}

export interface Product {
	id: string;
	name: string;
	description?: string;
	price: number;
	originalPrice?: number;
	rating: number;
	reviewCount: number;
	image: string;
	discount?: number;
	badge?: [string];
}

export interface SponsoredProduct {
	id: string;
	productId: string; // reference to actual product
	vendorId: string; // reference to vendor
	startDate: string; // ISO string (from backend)
	endDate: string;
	position: 'homepage' | 'category' | 'search';
	bidAmount: number;
	priority: number;
	impressions: number;
	punchLine: string;
	title: string;
	clicks: number;
	isActive: boolean;
	product: Product; // Optional: populated product details
}

export interface MenuItem {
	id: string;
	title: string;
	icon: ImageSourcePropType;
	color?: string;
	iconSize?: number;
}

export interface MenuGroup {
	id: string;
	title: string;
	items: MenuItem[];
}

export type AddressLabel =
	| 'Home'
	| 'Work'
	| 'Office'
	| 'University'
	| 'Friend'
	| 'Other';

export type OtpContext = 'signup' | 'change-email' | 'password-reset';

export interface Address {
	_id: string;
	name: string;
	email: string;
	phone: string;
	houseNum?: string;
	streetNum?: string;
	city: string;
	province:
		| 'Punjab'
		| 'Sindh'
		| 'Balochistan'
		| 'Khyber Pakhtunkhwa'
		| 'Gilgit-Baltistan'
		| 'Azad Kashmir';
	postalCode?: string;
	country: 'Pakistan';
	isDefault: boolean;
	label: AddressLabel;
	fullAddress?: string;
}

// request DTO (used only when sending/receiving API)
export type AddressDTO = Omit<Address, '_id' | 'province' | 'country'> & {
	province: string;
	country: string;
};

export interface NotificationSettings {
	enableNotifications: boolean;
	emailAlerts: boolean;
	orderAlerts: boolean;
	generalAlerts: boolean;
}

// export interface User {
// 	_id: string;
// 	username: string;
// 	name?: string;
// 	email: string;
// 	phoneNumber?: string;
// 	isVerified: boolean;
// 	addresses: Address[];
// 	avatar: {
// 		url: string;
// 		public_id: string;
// 	};
// 	isBlocked: boolean;
// 	role: 'user' | 'admin' | 'vendor' | 'provider';
// 	wishlist?: string[]; // array of product IDs
// 	createdAt: string; // ISO Date
// 	notificationSettings: NotificationSettings;
// }

export interface AuthState {
	user: User | null;
	token: string | null;
	error: string | null;
	isLoading: boolean;
	isInitialized: boolean; //Track if we've loaded the token on app start

	// OTP flow
	otpExpiresAt: string | null;
	pendingEmail: string | null; // email that’s being verified

	// reset flow
	resetVerified: boolean | null;
}

export type ModalType = 'success' | 'error' | 'warning' | 'info';

// interfaces/forms.ts

export type FormFields =
	| 'email'
	| 'password'
	| 'newPassword'
	| 'confirmPassword'
	| 'currentPassword'
	| 'username'
	| 'firstName'
	| 'lastName'
	| 'phone'
	| 'otp';
// add more fields your app uses

export type FormData = Partial<Record<FormFields, string>>;
export type FormErrors = Partial<Record<FormFields, string | null>>;

// types.ts (or wherever your interfaces are)
export interface SectionConfig {
	backgroundColor?: string;
	layout?: 'grid' | 'carousel' | 'banner' | 'horizontal';
	showSeeAll?: boolean;
	autoScroll?: boolean;
	numColumns?: number;
	numRows?: number;
	borderRadius?: number;
	padding?: number;
	cardVariant?: 'standard' | 'compact' | 'expanded';
}

export interface Section {
	id: string;
	title: string;
	filters?: Record<string, any>;
	config?: SectionConfig;
}
