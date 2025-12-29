import { animations } from '@/constants/animations';
import { COLORS } from '@/constants/colors';
import { ButtonProps } from '@/interfaces/interface';
import {
	getBgVariantStyle,
	getLoaderColor,
	getTextVariantStyle,
} from '@/utils/helpers';
import { useTheme } from '@/utils/theme/ThemeContext';
import { clsx } from 'clsx';
import React, { useCallback, useMemo } from 'react';
import {
	Image,
	Text,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
	useColorScheme,
} from 'react-native';
import LottieLoader from './LottieLoader';

// Size configurations mapped to your naming convention
const SIZE_CONFIG = {
	sm: {
		height: 'h-10',
		paddingX: 'px-3',
		textSize: 'text-xs',
		fontSize: 12,
		iconSize: 16,
		loaderSize: 40,
	},
	md: {
		height: 'h-14',
		paddingX: 'px-4',
		textSize: 'text-body-sm',
		fontSize: 14,
		iconSize: 20,
		loaderSize: 48,
	},
	lg: {
		height: 'h-16',
		paddingX: 'px-6',
		textSize: 'text-lg',
		fontSize: 18,
		iconSize: 24,
		loaderSize: 56,
	},
} as const;

const CustomButton: React.FC<ButtonProps> = ({
	label,
	loading = false,
	disabled = false,
	onPress,
	bgVariant = 'primary',
	textVariant = 'primary',
	icon,
	iconPosition = 'start',
	accessibilityLabel,
	accessibilityRole = 'button',
	className,

	// Enhanced props
	size = 'md',
	height,
	width,
	iconSize,
	iconTintColor,
	fontSize,
	fontWeight,
	paddingHorizontal,
	marginBottom,
	loaderSize,
	buttonStyle,
	textStyle,
	iconStyle,
	borderRadius,
	fullWidth = false,
}) => {
	const theme = useTheme();
	const colorScheme = useColorScheme();
	const isDark = theme === 'dark' || colorScheme === 'dark';
	const isDisabled = disabled || loading;

	const sizeConfig = SIZE_CONFIG[size as keyof typeof SIZE_CONFIG];

	// Dynamic styles
	const dynamicStyles = useMemo(() => {
		const styles: ViewStyle = {};

		if (height) styles.height = height;
		if (width) {
			if (typeof width === 'string') {
				styles.width = width as any; // For percentage strings like '100%'
			} else {
				styles.width = width;
			}
		}
		if (paddingHorizontal) {
			styles.paddingHorizontal = paddingHorizontal;
		}
		if (marginBottom !== undefined) {
			styles.marginBottom = marginBottom;
		}
		if (borderRadius !== undefined) {
			styles.borderRadius = borderRadius;
		}
		if (fullWidth) {
			styles.width = '100%';
		}

		return styles;
	}, [height, width, paddingHorizontal, marginBottom, borderRadius, fullWidth]);

	const buttonClasses = useMemo(
		() =>
			clsx(
				'justify-center items-center flex-row rounded-full mb-2',
				sizeConfig.height,
				!paddingHorizontal && sizeConfig.paddingX,
				getBgVariantStyle(bgVariant),
				isDisabled && 'opacity-50',
				fullWidth && 'w-full',
				className
			),
		[
			sizeConfig.height,
			sizeConfig.paddingX,
			paddingHorizontal,
			bgVariant,
			isDisabled,
			fullWidth,
			className,
		]
	);

	const textClasses = useMemo(
		() =>
			clsx(
				'font-nexa-bold tracking-wide',
				!fontSize && sizeConfig.textSize, // Only use class if no custom fontSize
				getTextVariantStyle(textVariant)
			),
		[fontSize, sizeConfig.textSize, textVariant]
	);

	// Dynamic text styling
	const dynamicTextStyle = useMemo(() => {
		const styles: TextStyle = {};

		if (fontSize) styles.fontSize = fontSize;
		if (fontWeight) styles.fontWeight = fontWeight;

		return styles;
	}, [fontSize, fontWeight]);

	const finalIconSize = iconSize || sizeConfig.iconSize;
	const finalLoaderSize = loaderSize || sizeConfig.loaderSize;
	const finalIconTintColor = useMemo(() => {
		if (iconTintColor) return iconTintColor;

		// Adjust icon color based on button variant and theme
		if (isDisabled) {
			return isDark ? '#6B7280' : '#9CA3AF';
		}

		if (bgVariant === 'outline') {
			return isDark ? '#F3F4F6' : COLORS.light.pallete[950];
		}

		return COLORS.light.pallete[950];
	}, [iconTintColor, isDisabled, isDark, bgVariant]);

	const renderIcon = useCallback(
		(position: 'start' | 'end') => {
			if (iconPosition !== position || !icon) return null;

			const marginClass = position === 'start' ? 'mr-2' : 'ml-2';

			return (
				<Image
					source={icon}
					style={[
						{
							width: finalIconSize,
							height: finalIconSize,
							tintColor: finalIconTintColor,
						},
						iconStyle,
					]}
					className={marginClass}
					accessibilityRole="image"
					accessibilityLabel={`${label} icon`}
				/>
			);
		},
		[iconPosition, icon, finalIconSize, finalIconTintColor, iconStyle, label]
	);

	const content = useMemo(
		() => (
			<View className="flex-row justify-center items-center">
				{loading ? (
					<LottieLoader
						animation={animations.spinner}
						color={getLoaderColor(textVariant)}
						size={finalLoaderSize}
					/>
				) : (
					<>
						{renderIcon('start')}
						<Text
							className={textClasses}
							style={[dynamicTextStyle, textStyle]}
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{label}
						</Text>
						{renderIcon('end')}
					</>
				)}
			</View>
		),
		[
			loading,
			label,
			textClasses,
			dynamicTextStyle,
			textStyle,
			finalLoaderSize,
			textVariant,
			renderIcon,
		]
	);

	const touchableProps = useMemo(
		() => ({
			onPress,
			disabled: isDisabled,
			activeOpacity: loading ? 1 : isDisabled ? 1 : 0.8,
			accessibilityLabel: accessibilityLabel ?? label,
			accessibilityRole,
			accessibilityState: {
				disabled: isDisabled,
				busy: loading,
			},
			accessibilityHint: isDisabled
				? 'Button is disabled'
				: loading
				? 'Loading, please wait'
				: `Tap to ${label.toLowerCase()}`,
			// Note: TouchableOpacity doesn't have SelectableBackground - this is for TouchableNativeFeedback (Android)
			// If you need ripple effect, use TouchableNativeFeedback instead
		}),
		[onPress, isDisabled, loading, accessibilityLabel, label, accessibilityRole]
	);

	return (
		<TouchableOpacity
			{...touchableProps}
			className={buttonClasses}
			style={[dynamicStyles, buttonStyle]}
		>
			{content}
		</TouchableOpacity>
	);
};

export default CustomButton;
