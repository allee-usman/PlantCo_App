// api.utils.ts
export interface ApiError {
	message: string;
	code?: number;
	details?: any;
}

export function parseApiError(err: unknown): ApiError {
	// Check if AxiosError
	if (err && typeof err === 'object' && err !== null) {
		const e = err as {
			response?: { data?: { message?: string }; status?: number };
			message?: string;
		};
		return {
			message: e.response?.data?.message || e.message || 'Something went wrong',
			code: e.response?.status,
			details: e.response?.data,
		};
	}

	return { message: 'Something went wrong' };
}
