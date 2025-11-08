export type CategoryType = 'product' | 'service' | 'both';

export interface ExtraImage {
	url?: string;
	public_id?: string;
	alt?: string;
	isPrimary?: boolean;
	order?: number;
}

export interface Category {
	_id: string;
	name: string;
	slug?: string;
	parent?: string | null;
	type: CategoryType;
	image?: ExtraImage | null;
	level?: number;
	isActive?: boolean;
	isDeleted?: boolean;
	createdBy?: string;
	order?: number;
	productCount?: number;
	description?: string;
	metaTitle?: string;
	metaDescription?: string;
	createdAt?: string;
	updatedAt?: string;
	children?: Category[]; // populated in some endpoints
}
