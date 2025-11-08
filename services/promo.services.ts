// services/promo.services.ts
import { BASE_URI } from '@/constants/constant';
import api from '@/utils/api';

export type PromoValidationResult = {
	valid: boolean;
	code?: string;
	type?: 'percent' | 'flat';
	value?: number; // percent (e.g. 10) or flat amount (e.g. 50)
	message?: string;
};

export const validatePromo = async (
	code: string
): Promise<PromoValidationResult> => {
	try {
		const { data } = await api.post(`${BASE_URI}/promos/validate`, {
			code: code.trim().toUpperCase(),
		});
		// Expected server response shape: { data: { valid: true, type: 'percent'|'flat', value: 10 } }
		return data?.data ?? { valid: false, message: 'Invalid promo' };
	} catch (err: any) {
		console.warn('Promo validation error', err);
		// Return conservative invalid result (component will show toast)
		return {
			valid: false,
			message: err?.response?.data?.message ?? 'Validation failed',
		};
	}
};
export default { validatePromo };
