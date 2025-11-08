import { BASE_URI } from '@/constants/constant';
import { getSecureItem } from '@/utils/secureStore';
import axios from 'axios';

const api = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_URL || BASE_URI, // Android emulator localhost
	headers: {
		'Content-Type': 'application/json',
	},
});

// Add token interceptor
api.interceptors.request.use(async (config) => {
	const token = await getSecureItem('authToken'); // stored token
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default api;
