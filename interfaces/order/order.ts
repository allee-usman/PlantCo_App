export interface OrderStep {
	id: number;
	title: string;
	date: string;
	status: 'completed' | 'pending' | 'current';
}

export interface Order {
	id: string;
	orderNumber: string;
	placedDate: string; // ISO string usually in DB
	items: number;
	price: number; // keep as number in DB, format later in UI
	status:
		| 'pending'
		| 'processing'
		| 'out_for_delivery'
		| 'delivered'
		| 'cancelled'
		| 'refused';
	statusDate: string; // ISO string
	expanded?: boolean;
}
