export interface IOrderItem {
	_id: string;
	productId: string;
	vendorId: string;
	productName: string;
	productType: 'plant' | 'accessory';
	sku: string;
	quantity: number;
	price: number;
	compareAtPrice?: number;
	totalPrice: number;
	productSnapshot: {
		image?: string;
		plantDetails?: Record<string, any> | null;
		accessoryDetails?: Record<string, any> | null;
	};
}

export interface IPricing {
	subtotal: number;
	shipping: number;
	tax: number;
	discount: number;
	total: number;
	currency: string;
}

export interface IAddress {
	fullName: string;
	phone: string;
	street: string;
	city: string;
	state?: string;
	postalCode?: string;
	country: string;
	[key: string]: any; // extra address fields if needed
}

export interface IShipping {
	address: IAddress;
	method: string;
	cost: number;
	estimatedDelivery?: string; // Date as string from API
	actualDelivery?: string;
	trackingNumber?: string;
	carrier?: string;
}

export type PaymentMethodType =
	| 'cod'
	| 'credit_card'
	| 'debit_card'
	| 'paypal'
	| 'apple_pay'
	| 'google_pay';

export interface IPaymentMethod {
	type: PaymentMethodType;
	last4?: string;
	brand?: string;
	gateway?: string;
	transactionId?: string;
}

export interface IBilling {
	address: IAddress;
	paymentMethod: IPaymentMethod;
}

export interface IOrderDiscount {
	code?: string;
	type?: 'percentage' | 'fixed' | 'free_shipping';
	amount?: number;
	description?: string;
}

export interface IOrderTimeline {
	_id: string;
	status:
		| 'pending'
		| 'confirmed'
		| 'processing'
		| 'shipped'
		| 'delivered'
		| 'cancelled'
		| 'refunded';
	date: string; // ISO date string
	note?: string;
	trackingNumber?: string;
}

export interface IOrder {
	_id: string;
	orderNumber: string;
	customerId: string;

	status:
		| 'pending'
		| 'confirmed'
		| 'processing'
		| 'shipped'
		| 'delivered'
		| 'cancelled'
		| 'refunded';

	paymentStatus:
		| 'pending'
		| 'paid'
		| 'failed'
		| 'refunded'
		| 'partially_refunded';
	fulfillmentStatus: 'unfulfilled' | 'processing' | 'shipped' | 'delivered';

	items: IOrderItem[];
	pricing: IPricing;
	discounts?: IOrderDiscount[];
	shipping: IShipping;
	billing: IBilling;
	timeline: IOrderTimeline[];

	notes?: string;
	customerNotes?: string;

	totalItems?: number; // from virtual
	hasPlants?: boolean; // from virtual

	createdAt: string;
	updatedAt: string;
}

export interface IOrderSummary {
	_id: string;
	orderNumber: string;
	placedDate: string; // derived from createdAt (ISO string)
	totalItems: number; // sum of item quantities
	totalPrice: number; // from pricing.total
	status:
		| 'pending'
		| 'confirmed'
		| 'processing'
		| 'out_for_delivery'
		| 'delivered'
		| 'cancelled'
		| 'refused'
		| 'refunded';
	statusDate: string; // latest timeline status date
	expanded?: boolean; // UI only (not from backend)
}

export interface OrderItem {
	productId: string;
	productName?: string;
	quantity: number;
	totalPrice?: number;
}

export interface Pricing {
	subtotal: number;
	shipping: number;
	tax: number;
	discount?: number;
	total: number;
	currency: string;
}

export interface Shipping {
	address: any; // You can replace this with a proper Address type
	method: string;
	cost: number;
	estimatedDelivery?: string;
}

export interface Billing {
	address: any;
	paymentMethod: any;
}

export interface TimelineEvent {
	status: string;
	date: string;
	note: string;
	updatedBy?: string;
}

// export interface IOrder {
// 	_id: string;
// 	customerId: string;
// 	items: OrderItem[];
// 	status: string;
// 	pricing: Pricing;
// 	shipping: Shipping;
// 	billing: Billing;
// 	timeline: TimelineEvent[];
// 	createdAt: string;
// 	updatedAt: string;
// }

export interface CreateOrderPayload {
	items: { productId: string; quantity: number }[];
	pricing: Pricing;
	shipping: Shipping;
	billing: Billing;
	discounts?: any[];
	notes?: string;
	customerNotes?: string;
}
