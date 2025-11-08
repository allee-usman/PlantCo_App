export interface WhishlistProduct {
	id: string;
	name: string;
	price: number;
	image: string;
	category: 'Plants' | 'Accessories';
	inStock: boolean;
	description: string;
	rating?: number;
	reviewCount?: number;
}

export interface WishlistItem extends WhishlistProduct {
	addedAt: Date;
}

// export interface CartItem extends WhishlistProduct {
// 	quantity: number;
// 	addedAt: Date;
// }
