// utils/currency.ts
export const formatCurrency = (value: number, currency = 'PKR') => {
	// Using Intl.NumberFormat for correct thousands separators and currency symbol optional.
	try {
		// We use style 'decimal' so you can show "Rs. 1,234" and control prefix in UI.
		const nf = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });
		return nf.format(Math.round(value));
	} catch (e) {
		return String(Math.round(value));
	}
};
