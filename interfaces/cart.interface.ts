export interface CartItem {
	id: string;
	productId: string;
	name: string;
	description: string;
	price: number;
	quantity: number;
	image: string;
	stock?: number;
	category?: string;
}

export interface CartState {
	items: CartItem[];
	isLoading: boolean;
	error: string | null;
	lastSynced: string | null;
}
