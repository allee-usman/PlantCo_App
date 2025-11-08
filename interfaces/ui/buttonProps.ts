import {
	ImageSourcePropType,
	ImageStyle,
	TextStyle,
	TouchableOpacityProps,
	ViewStyle,
} from 'react-native';

export interface ButtonProps extends TouchableOpacityProps {
	label: string;
	loading?: boolean;
	disabled?: boolean;
	icon?: ImageSourcePropType;
	iconPosition?: 'start' | 'end'; // default: 'start'
	bgVariant?:
		| 'primary'
		| 'secondary'
		| 'danger'
		| 'outline'
		| 'success'
		| 'gradient'; // default: 'gradient'
	textVariant?:
		| 'default'
		| 'primary'
		| 'secondary'
		| 'danger'
		| 'outline'
		| 'success'
		| 'gradient'; // default: 'gradient'
	size?: 'sm' | 'md' | 'lg'; // default: 'md'
	accessibilityLabel?: string;
	accessibilityRole?: 'button' | 'link';
	className?: string;

	// Enhanced customization options
	// Custom dimensions (overrides size)
	height?: number;
	width?: number | string;

	// Icon customization
	iconSize?: number;
	iconTintColor?: string;

	// Text customization
	fontSize?: number;
	fontWeight?:
		| 'normal'
		| 'bold'
		| '100'
		| '200'
		| '300'
		| '400'
		| '500'
		| '600'
		| '700'
		| '800'
		| '900';

	// Spacing
	paddingHorizontal?: number;
	marginBottom?: number;

	// Loading customization
	loaderSize?: number;

	// Style overrides
	buttonStyle?: ViewStyle;
	textStyle?: TextStyle;
	iconStyle?: ImageStyle;

	// Ripple effect (Android)
	rippleColor?: string;

	// Rounded corners customization
	borderRadius?: number;

	// Full width option
	fullWidth?: boolean;
}
