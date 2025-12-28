export type ServiceType =
	| 'landscaping'
	| 'lawn_mowing'
	| 'garden_design'
	| 'tree_trimming'
	| 'plant_installation'
	| 'pest_control'
	| 'fertilization'
	| 'seasonal_cleanup'
	| 'plant_care'
	| 'consultation';

export interface ServiceMeta {
	tags: string[];
	rating: number; // avg rating for sorting/filtering
}
export interface ServiceImage {
	url: string;
	alt?: string;
}

export interface Service {
	_id?: string; // from MongoDB (optional on create)
	provider: string; // provider user _id (ObjectId string)

	title: string;
	slug?: string;

	description?: string;

	serviceType: ServiceType;

	hourlyRate: number;
	durationHours: number;
	currency: string;

	active: boolean;

	image?: ServiceImage;

	meta: ServiceMeta;

	createdAt?: string;
	updatedAt?: string;
}
