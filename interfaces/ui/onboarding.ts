import { ImageSourcePropType } from 'react-native';
export interface OnboardingItem {
	id: number;
	title: string;
	description: string;
	image: ImageSourcePropType;
}
