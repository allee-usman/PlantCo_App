import { COLORS } from '@/constants/colors';
import { ButtonProps } from '@/interfaces/interface';

export const getBgVariantStyle = (variant: ButtonProps['bgVariant']) => {
	switch (variant) {
		case 'primary':
			return 'bg-light-pallete-400 dark:bg-light-pallete-300';
		case 'secondary':
			return 'bg-gray-200 dark:bg-gray-700';
		case 'danger':
			return 'bg-red-600 dark:bg-red-500';
		case 'success':
			return 'bg-green-500 dark:bg-green-400';
		case 'outline':
			return 'bg-transparent dark:border-light-pallete-500 border-light-pallete-400 border-[1.5px]';
		default:
			return 'bg-light-pallete-400 dark:bg-light-pallete-300';
	}
};

export const getTextVariantStyle = (variant: ButtonProps['textVariant']) => {
	switch (variant) {
		case 'primary':
			return 'text-black dark:text-gray-950';
		case 'secondary':
			return 'text-gray-700 dark:text-gray-100';
		case 'danger':
			return 'text-gray-50 dark:text-red-100';
		case 'success':
			return 'text-green-100 dark:text-green-950';
		case 'gradient':
			return 'text-white';
		case 'outline':
			return 'dark:text-gray-50 text-gray-700';
		default:
			return 'dark:text-gray-950 text-black';
	}
};

export const getLoaderColor = (textVariant: ButtonProps['textVariant']) => {
	switch (textVariant) {
		case 'primary':
			return COLORS.light.pallete[900];
		case 'secondary':
			return COLORS.gray[700];
		case 'danger':
			return COLORS.gray[50];
		case 'success':
			return COLORS.gray[50];
		case 'gradient':
			return COLORS.gray[50];
		case 'outline':
			return COLORS.gray[700];
		default:
			return COLORS.light.pallete[950];
	}
};
