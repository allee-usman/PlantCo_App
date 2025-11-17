import { COLORS } from '@/constants/colors';
import { Section, ShippingOption } from '@/interfaces/types';
import Constants from 'expo-constants';

export const BASE_URI = `http://${Constants.expoConfig?.hostUri
	?.split(':')
	.shift()}:5000/api`;

// export const BASE_URI = 'http://10.9.133.188:5000/api';

export const provinces = [
	'Punjab',
	'Sindh',
	'Khyber Pakhtunkhwa',
	'Balochistan',
];

export const AddressLabels = [
	{ id: 'home', label: 'Home', icon: 'home-outline' },
	{ id: 'work', label: 'Work', icon: 'briefcase-outline' },
	{ id: 'office', label: 'Office', icon: 'business-outline' },
	{ id: 'university', label: 'University', icon: 'library-outline' },
	{ id: 'friend', label: 'Friend', icon: 'people-outline' },
	{ id: 'other', label: 'Other', icon: 'location-outline' },
] as const;

export const shippingOptions: ShippingOption[] = [
	{
		id: 'standard',
		type: 'Standard Shipping',
		priceLabel: '200',
		deliveryRange: '3-5 days',
	},
	{
		id: 'express',
		type: 'Express Shipping',
		priceLabel: '350',
		deliveryRange: '1-2 days',
	},
	{
		id: 'sameDay',
		type: 'Same Day',
		priceLabel: '600',
		deliveryRange: 'Same day delivery',
	},
];

// OTP Input Constants
export const CELL_COUNT = 4;
export const RESEND_COOLDOWN = 60; // 1 minute

export const HEADER_SCROLL_DISTANCE = 120;
export const HEADER_MAX_HEIGHT = 160;
export const HEADER_MIN_HEIGHT = 110;
export const CONTENT_TOP_PADDING = HEADER_MAX_HEIGHT;

export const PLANT_SECTIONS: Section[] = [
	{
		id: 'quick-categories',
		title: 'Quick Categories',
	},
	{
		id: 'promo-banner',
		title: 'Special Offers',

		config: {
			backgroundColor: '#f5f5f5',
			layout: 'banner', // 🪄 No product fetch, just banner
			autoScroll: true,
		},
	},

	{
		id: 'sponsored',
		title: 'Sponsored',
		config: {
			layout: 'grid',
			numColumns: 3,
			numRows: 2,
			backgroundColor: 'transparent',
		},
		filters: {
			featured: true,
			limit: 6,
			inStock: true,
			sort: 'createdAt',
		},
	},

	{
		id: 'top-deals',
		title: 'Top Deals',
		config: {
			layout: 'horizontal', // 👈 Horizontal scroll
			// backgroundColor: '#E8F5E9',
		},
		filters: {
			type: 'plant',
			onSale: true,
			limit: 8,
			sort: 'price:desc',
		},
	},

	{
		id: 'wishlist',
		title: 'Add to your Wishlist',
		config: {
			layout: 'horizontal', // 👈 Horizontal scroll
			// backgroundColor: '#FFFDE7',
		},
		filters: {
			type: 'plant',
			bestseller: true,
			limit: 6,
		},
	},

	{
		id: 'must-have',
		title: 'Must-have Plants',
		config: {
			layout: 'horizontal', // 👈 Horizontal scroll
			// backgroundColor: '#E3F2FD',
		},
		filters: {
			type: 'plant',
			careLevel: 'beginner',
			limit: 6,
		},
	},

	{
		id: 'lawn-upgrade',
		title: 'Your Lawn Upgrade',
		config: {
			layout: 'horizontal', // 👈 Horizontal scroll
			// backgroundColor: '#F1F8E9',
		},
		filters: {
			type: 'accessory',
			tags: ['lawn'],
			inStock: true,
			limit: 8,
		},
	},

	{
		id: 'craft',
		title: 'Craft your Garden',

		config: {
			layout: 'horizontal', // 👈 Horizontal scroll
			// backgroundColor: '#FFF3E0',
		},
		filters: {
			type: 'accessory',
			limit: 8,
		},
	},

	{
		id: 'spotlight',
		title: "Spotlight's On",
		config: {
			layout: 'horizontal', // 👈 Horizontal scroll
			// backgroundColor: '#EDE7F6',
		},
		filters: {
			type: 'plant',
			seasonal: true,
			limit: 6,
		},
	},
];
export const SERVICE_SECTIONS: Section[] = [
	{
		id: 'quick-categories',
		title: 'Quick Categories',
	},
	{
		id: 'promo-banner',
		title: 'Special Offers',

		config: {
			backgroundColor: '#f5f5f5',
			layout: 'banner', // 🪄 No product fetch, just banner
			autoScroll: true,
		},
	},

	{
		id: 'top-rated',
		title: 'Top Rated Gardner',
		subtitle: 'Best gardner in your area',
		config: {
			layout: 'horizontal', // 👈 Horizontal scroll
			// backgroundColor: '#E8F5E9',
		},
		filters: {
			type: 'plant',
			onSale: true,
			limit: 8,
			sort: 'price:desc',
		},
	},

	{
		id: 'wishlist',
		title: 'Add to your Wishlist',
		config: {
			layout: 'horizontal', // 👈 Horizontal scroll
			// backgroundColor: '#FFFDE7',
		},
		filters: {
			type: 'plant',
			bestseller: true,
			limit: 6,
		},
	},

	{
		id: 'must-have',
		title: 'Must-have Plants',
		config: {
			layout: 'horizontal', // 👈 Horizontal scroll
			// backgroundColor: '#E3F2FD',
		},
		filters: {
			type: 'plant',
			careLevel: 'beginner',
			limit: 6,
		},
	},

	{
		id: 'lawn-upgrade',
		title: 'Your Lawn Upgrade',
		config: {
			layout: 'horizontal', // 👈 Horizontal scroll
			// backgroundColor: '#F1F8E9',
		},
		filters: {
			type: 'accessory',
			tags: ['lawn'],
			inStock: true,
			limit: 8,
		},
	},

	{
		id: 'craft',
		title: 'Craft your Garden',

		config: {
			layout: 'horizontal', // 👈 Horizontal scroll
			// backgroundColor: '#FFF3E0',
		},
		filters: {
			type: 'accessory',
			limit: 8,
		},
	},

	{
		id: 'spotlight',
		title: "Spotlight's On",
		config: {
			layout: 'horizontal', // 👈 Horizontal scroll
			// backgroundColor: '#EDE7F6',
		},
		filters: {
			type: 'plant',
			seasonal: true,
			limit: 6,
		},
	},
];

export const TABS_DATA = [
	{ id: 'products', label: 'Products' },
	{ id: 'services', label: 'Book a service' },
];

export { COLORS };

export const FREE_SHIPPING_THRESHOLD = 5000; // Rs. 5000 -> change to your desired threshold
