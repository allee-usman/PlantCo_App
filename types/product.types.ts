import { VendorProfile } from './user.types';

export interface IProductImage {
	url: string;
	alt: string;
	isPrimary?: boolean;
	order?: number;
}

export interface IPlantDetails {
	scientificName?: string;
	family?: string;
	commonNames?: string[];
	careLevel?: 'beginner' | 'intermediate' | 'expert';
	lightRequirement?: 'low' | 'medium' | 'bright-indirect' | 'direct';
	wateringFrequency?: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
	humidity?: string;
	temperature?: string;
	toxicity?: 'pet-safe' | 'toxic-to-pets' | 'toxic-to-humans' | 'unknown';
	matureSize?: string;
	growthRate?: 'slow' | 'medium' | 'fast';
	origin?: string;
	bloomTime?: string;
	repottingFrequency?: string;
}

export interface IAccessoryDetails {
	material?: string;
	color?: string;
	size?: string;
	hasDrainage?: boolean;
	includesSaucer?: boolean;
	suitableFor?: string[];
	style?: string;
	dimensions?: {
		length?: number;
		width?: number;
		height?: number;
	};
}

export interface IInventory {
	quantity: number;
	lowStockThreshold?: number;
	trackQuantity?: boolean;
	allowBackorder?: boolean;
}

export interface IShippingInfo {
	weight: number;
	dimensions?: { length?: number; width?: number; height?: number };
	fragile?: boolean;
	liveProduct?: boolean;
	shippingClass?: 'standard' | 'live-plants' | 'fragile' | 'oversized';
}

export interface IReviewStats {
	averageRating: number;
	totalReviews: number;
	ratingDistribution: {
		5: number;
		4: number;
		3: number;
		2: number;
		1: number;
	};
}

export interface IRecentReview {
	_id: string;
	customerId: string; // ObjectId as string
	customer: {
		name: string;
		verified: boolean;
	};
	images: {
		url: string;
		alt?: string;
	}[];
	rating: number;
	title?: string;
	comment: string;
	createdAt: string; // or Date if you're handling it as Date object
}

// Base Product

export interface IBaseProduct {
	_id: string;
	name: string;
	slug: string;
	type: 'plant' | 'accessory';
	description: string;
	shortDescription: string;
	price: number;
	compareAtPrice?: number;
	currency: string;
	sku: string;
	images: IProductImage[];
	status: 'active' | 'draft' | 'archived' | 'out-of-stock';
	featured?: boolean;
	bestseller?: boolean;
	seasonal?: boolean;
	vendor: VendorProfile;
	reviewStats?: IReviewStats;
	recentReviews: IRecentReview;
	stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock';
	isOnSale?: boolean;
	salePercentage?: number;
}

// --- Product Variations for Frontend Use ---

// Minimal version for carousels, sponsored, or listings
export interface IProductMinimal {
	id: string;
	name: string;
	image: string;
	price: number;
	compareAtPrice?: number;
	isOnSale?: boolean;
	salePercentage?: number;
}

// Full version for detail screen
export interface IProductDetailed extends IBaseProduct {
	plantDetails?: IPlantDetails;
	accessoryDetails?: IAccessoryDetails;
	inventory?: IInventory;
	shipping: IShippingInfo;
	categories?: string[];
	tags?: string[];
	relatedProducts?: string[];
	createdAt?: string;
	updatedAt?: string;
}

// For sponsored section (could be lighter)
export interface ISponsoredProduct {
	id: string;
	title: string;
	punchLine?: string;
	product: IProductMinimal;
}
