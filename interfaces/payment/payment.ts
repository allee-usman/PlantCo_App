export interface PaymentMethod {
	id: string;
	type: 'card' | 'paypal' | 'apple_pay' | 'google_pay' | 'bank_transfer';
	displayName: string;
	last4?: string; // For cards
	cardBrand?: 'visa' | 'mastercard' | 'amex' | 'discover';
	icon: string;
}

export interface PaymentSummaryData {
	// serviceName: string;
	ratePerHour: number;
	duration: number; // in hours (e.g., 1.5 for 1 hour 30 minutes)
	tip: number;
	paymentMethod: PaymentMethod;
	// taxes?: number;
	// discount?: number;
	// currency?: string;
}
