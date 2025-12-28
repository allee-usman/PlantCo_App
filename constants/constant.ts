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

export const services = [
	{
		id: '1',
		name: 'Electrician',
		image: 'https://images.pexels.com/photos/5854182/pexels-photo-5854182.jpeg',
		price: 1200,
		rating: 4.7,
		reviewCount: 89,
		specialities: ['Wiring', 'House Repair', 'Installations'],
		status: 'available',
		experience: '5 years experience',
		location: 'Johar Town, Lahore',
		completedJobs: 210,
		verified: true,
	},
	{
		id: '2',
		name: 'Plumber',
		image: 'https://images.pexels.com/photos/5854202/pexels-photo-5854202.jpeg',
		price: 900,
		rating: 4.5,
		reviewCount: 56,
		specialities: ['Leak Fix', 'Pipes', 'Water Motor'],
		status: 'busy',
		experience: '3 years experience',
		location: 'Wapda Town, Lahore',
		completedJobs: 140,
		verified: true,
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
		title: 'Service Categories',
	},

	{
		id: 'promo-banner',
		title: 'Hot Deals',
		config: {
			layout: 'banner',
			autoScroll: true,
			backgroundColor: '#f5f5f5',
		},
	},

	{
		id: 'near-you',
		title: 'Providers Near You',
		subtitle: 'Based on your location',
		mode: 'provider',
		config: {
			layout: 'horizontal',
			backgroundColor: 'transparent',
		},

		filters: {
			type: 'service',
			locationBased: true,
			limit: 6,
		},
	},

	{
		id: 'popular',
		title: 'Popular Services',
		subtitle: 'Most booked providers',
		mode: 'service',
		config: {
			backgroundColor: 'transparent',
			layout: 'grid',
			numColumns: 1,
		},

		filters: {
			type: 'service',
			sort: 'completedJobs:desc',
			limit: 6,
		},
	},

	// -------------------------
	// CATEGORY-WISE SECTIONS
	// -------------------------

	{
		id: 'lawn-care',
		title: 'Lawn Care',
		subtitle: 'Keep your lawn fresh and tidy',
		mode: 'service',
		config: {
			layout: 'grid',
			numColumns: 1,
			backgroundColor: 'transparent',
		},

		filters: {
			serviceTypes: ['landscaping', 'lawn_mowing', 'fertilization'],
		},
	},

	{
		id: 'garden-design',
		title: 'Garden Design & Build',
		subtitle: 'Design, create, and transform gardens',
		mode: 'service',
		config: {
			layout: 'grid',
			numColumns: 1,
			backgroundColor: 'transparent',
		},

		filters: {
			serviceTypes: ['garden_design', 'plant_installation'],
		},
	},

	{
		id: 'tree-services',
		title: 'Tree Services',
		subtitle: 'Shaping, trimming and care',
		mode: 'service',
		config: {
			layout: 'grid',
			numColumns: 1,
			backgroundColor: 'transparent',
		},

		filters: {
			serviceTypes: ['tree_trimming'],
		},
	},

	{
		id: 'plant-care',
		title: 'Plant Care & Maintenance',
		subtitle: 'Healthy, happy plants all year',
		mode: 'service',
		config: {
			layout: 'grid',
			numColumns: 1,
			backgroundColor: 'transparent',
		},

		filters: {
			serviceTypes: ['plant_care', 'seasonal_cleanup'],
		},
	},

	{
		id: 'pest-disease',
		title: 'Pest & Disease Control',
		subtitle: 'Protect your plants and lawn',
		mode: 'service',

		config: {
			layout: 'grid',
			numColumns: 1,
			backgroundColor: 'transparent',
		},

		filters: {
			serviceTypes: ['pest_control'],
		},
	},

	{
		id: 'consultation',
		title: 'Expert Advice',
		subtitle: 'Talk to a garden specialist',
		mode: 'service',

		config: {
			layout: 'grid',
			numColumns: 1,
			backgroundColor: 'transparent',
		},

		filters: {
			serviceTypes: ['consultation'],
		},
	},
];

export const TABS_DATA = [
	{ id: 'products', label: 'Products' },
	{ id: 'services', label: 'Book a service' },
];

export { COLORS };

export const FREE_SHIPPING_THRESHOLD = 5000; // Rs. 5000 -> change to your desired threshold
