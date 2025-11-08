import { BannerProps } from '@/interfaces/interface';
import { images } from './images';
export const banners: BannerProps[] = [
	{
		id: 1,
		title: 'Summer Deal',
		subtitle: '30% Off',
		ctaLabel: 'Get Offer Now',
		img: images.banner1,
		// date: 'Jul 25 - Aug 14',
	},
	{
		id: 2,
		title: 'Winter Sale',
		subtitle: 'Up to 50% Off',
		ctaLabel: 'Shop Now',
		img: images.banner2,
		// date: 'Dec 1 - Dec 31',
	},
	{
		id: 3,
		title: 'New Arrivals',
		subtitle: 'Up to 50% Off',
		ctaLabel: 'Explore',
		img: images.banner3,
		// date: 'Dec 1 - Dec 31',
	},
	{
		id: 4,
		title: 'Exclusive Offer',
		subtitle: 'Members Only',
		ctaLabel: 'Join Now',
		img: images.banner1,
		// date: 'Limited Time',
	},
];
