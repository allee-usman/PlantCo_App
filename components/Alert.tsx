import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { useColorScheme } from 'nativewind';
import React, { useMemo } from 'react';
import {
	Text,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';

// Alert variant types
export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

// Alert size types
export type AlertSize = 'sm' | 'md' | 'lg';

export interface AlertProps {
	// Content
	message: string;

	// Appearance
	variant?: AlertVariant;
	size?: AlertSize;

	// Behavior
	dismissible?: boolean;
	onDismiss?: () => void;
	onPress?: () => void;

	// Customization
	icon?: React.ReactNode;
	showIcon?: boolean;
	className?: string;
	containerStyle?: ViewStyle;
	textStyle?: TextStyle;

	// Border style
	borderStyle?: 'left' | 'full' | 'none';
	rounded?: boolean;
}

// Size configurations
const SIZE_CONFIG = {
	sm: {
		padding: 'px-3 py-2',
		textSize: 'text-body-xs',
		iconSize: 12,
		minHeight: 'min-h-[36px]',
		dismissButtonSize: 'text-body-sm',
	},
	md: {
		padding: 'px-4 py-3',
		textSize: 'text-sm',
		iconSize: 14,
		minHeight: 'min-h-[48px]',
		dismissButtonSize: 'text-body-sm',
	},
	lg: {
		padding: 'px-5 py-4',
		textSize: 'text-base',
		iconSize: 18,
		minHeight: 'min-h-[52px]',
		dismissButtonSize: 'text-lg',
	},
} as const;

// Default icons for each variant
const DefaultIcons = {
	success: (size: number, isDark: boolean) => (
		<View
			style={{ width: size, height: size }}
			className={clsx(
				'rounded-full items-center justify-center',
				isDark ? 'bg-green-500' : 'bg-green-600'
			)}
		>
			<Text className="text-white font-bold" style={{ fontSize: size * 0.6 }}>
				✓
			</Text>
		</View>
	),
	error: (size: number, isDark: boolean) => (
		<View
			style={{ width: size, height: size }}
			className={clsx(
				'rounded-full items-center justify-center',
				isDark ? 'bg-red-500' : 'bg-red-600'
			)}
		>
			<Text className="text-white font-bold" style={{ fontSize: size * 0.6 }}>
				✕
			</Text>
		</View>
	),
	warning: (size: number, isDark: boolean) => (
		<View
			style={{ width: size, height: size }}
			className={clsx(
				'rounded-full items-center justify-center',
				isDark ? 'bg-amber-500' : 'bg-amber-600'
			)}
		>
			<Text className="text-white font-bold" style={{ fontSize: size * 0.6 }}>
				!
			</Text>
		</View>
	),
	info: (size: number, isDark: boolean) => (
		<View
			style={{ width: size, height: size }}
			className={clsx(
				'rounded-full items-center justify-center',
				isDark ? 'bg-blue-500' : 'bg-blue-600'
			)}
		>
			<Text className="text-white font-bold" style={{ fontSize: size * 0.6 }}>
				i
			</Text>
		</View>
	),
};

const Alert: React.FC<AlertProps> = ({
	message,
	variant = 'info',
	size = 'md',
	dismissible = false,
	onDismiss,
	onPress,
	icon,
	showIcon = true,
	className,
	containerStyle,
	textStyle,
	borderStyle = 'left',
	rounded = true,
}) => {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';
	const sizeConfig = SIZE_CONFIG[size as keyof typeof SIZE_CONFIG];

	// Get variant styles
	const getVariantStyles = useMemo(() => {
		const baseStyles = [];

		// Border styles
		if (borderStyle === 'left') {
			baseStyles.push('border-l-4');
		} else if (borderStyle === 'full') {
			baseStyles.push('border');
		}

		// Rounded corners
		if (rounded) {
			baseStyles.push('rounded-lg');
		}

		switch (variant) {
			case 'success':
				return clsx(
					...baseStyles,
					isDark
						? 'bg-green-950/30 border-green-500'
						: 'bg-green-50 border-green-500',
					borderStyle === 'full' &&
						(isDark ? 'border-green-600' : 'border-green-200')
				);
			case 'error':
				return clsx(
					...baseStyles,
					isDark ? 'bg-red-950/30 border-red-500' : 'bg-red-50 border-red-500',
					borderStyle === 'full' &&
						(isDark ? 'border-red-600' : 'border-red-200')
				);
			case 'warning':
				return clsx(
					...baseStyles,
					isDark
						? 'bg-amber-950/30 border-amber-500'
						: 'bg-amber-50 border-amber-500',
					borderStyle === 'full' &&
						(isDark ? 'border-amber-600' : 'border-amber-200')
				);
			case 'info':
				return clsx(
					...baseStyles,
					isDark
						? 'bg-blue-950/30 border-blue-500'
						: 'bg-blue-50 border-blue-500',
					borderStyle === 'full' &&
						(isDark ? 'border-blue-600' : 'border-blue-200')
				);
			default:
				return clsx(
					...baseStyles,
					isDark ? 'bg-gray-800 border-gray-500' : 'bg-gray-50 border-gray-500'
				);
		}
	}, [variant, isDark, borderStyle, rounded]);

	// Get text color for variant
	const getTextColor = useMemo(() => {
		switch (variant) {
			case 'success':
				return isDark ? 'text-green-100' : 'text-green-600';
			case 'error':
				return isDark ? 'text-red-100' : 'text-red-500';
			case 'warning':
				return isDark ? 'text-amber-100' : 'text-amber-800';
			case 'info':
				return isDark ? 'text-blue-100' : 'text-blue-800';
			default:
				return isDark ? 'text-gray-100' : 'text-gray-800';
		}
	}, [variant, isDark]);

	// Get container border color (subtle darker than background)
	const getContainerBorderColor = useMemo(() => {
		switch (variant) {
			case 'success':
				return 'dark:border-green-800/40 border-green-200';
			case 'error':
				return 'dark:border-red-800/40 border-red-500';
			case 'warning':
				return 'border-amber-800/40 border-amber-200';
			case 'info':
				return 'border-blue-800/40 border-blue-500';
			default:
				return 'border-gray-700/40 border-gray-200';
		}
	}, [variant]);

	// Render icon
	const renderIcon = useMemo(() => {
		if (!showIcon) return null;

		if (icon) return icon;

		const IconComponent = DefaultIcons[variant];
		return IconComponent(sizeConfig.iconSize, isDark);
	}, [showIcon, icon, variant, sizeConfig.iconSize, isDark]);

	// Handle press
	const handlePress = () => {
		if (onPress) {
			onPress();
		}
	};

	// Handle dismiss
	const handleDismiss = () => {
		if (onDismiss) {
			onDismiss();
		}
	};

	const ContentWrapper = onPress ? TouchableOpacity : View;
	const wrapperProps = onPress
		? {
				onPress: handlePress,
				activeOpacity: 0.7,
		  }
		: {};

	return (
		<ContentWrapper
			{...wrapperProps}
			className={clsx(
				// Base styles
				'flex-row items-center mb-4 border',
				sizeConfig.padding,
				sizeConfig.minHeight,
				// Variant styles
				getVariantStyles,
				// Custom styles
				className
				// getContainerBorderColor
			)}
			style={[containerStyle, { borderWidth: 0.5 }]}
		>
			{/* Icon */}
			{renderIcon && <View className="mr-2 flex-shrink-0">{renderIcon}</View>}

			{/* Message */}
			<View className="flex-1">
				<Text
					className={clsx(
						'leading-relaxed font-nexa-bold',
						sizeConfig.textSize,
						getTextColor
					)}
					style={textStyle}
				>
					{message}
				</Text>
			</View>

			{/* Dismiss button */}
			{dismissible && (
				<TouchableOpacity
					onPress={handleDismiss}
					className="ml-3 flex-shrink-0 p-1"
					hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
				>
					<Ionicons name="close" size={12} color={COLORS.gray[500]} />
					{/* <Text
						className={clsx(
							'leading-none font-medium',
							sizeConfig.dismissButtonSize,
							isDark
								? 'text-gray-400 hover:text-gray-300'
								: 'text-gray-500 hover:text-gray-700'
						)}
					>
						×
					</Text> */}
				</TouchableOpacity>
			)}
		</ContentWrapper>
	);
};

export default Alert;
