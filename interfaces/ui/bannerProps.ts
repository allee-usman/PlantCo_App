import { ImageSourcePropType } from 'react-native';
export interface BannerProps {
	id: number;
	title: string;
	img: ImageSourcePropType;
	ctaLabel: string;
	subtitle?: string;
	date?: string;
}
