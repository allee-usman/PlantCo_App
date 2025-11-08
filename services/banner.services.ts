import { IBanner } from '@/types/banner.types';
import api from '@/utils/api';

export const getBanners = async (
	type: 'product' | 'service'
): Promise<IBanner[]> => {
	const res = await api.get(`/banners`, {
		params: { type },
	});
	return res.data.data;
};
