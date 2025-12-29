import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import React, { forwardRef, useState } from 'react';
import {
	Image,
	ImageSourcePropType,
	KeyboardTypeOptions,
	NativeSyntheticEvent,
	ReturnKeyTypeOptions,
	Text,
	TextInput,
	TextInputFocusEventData,
	TextInputProps,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';

export interface InputFieldProps extends Omit<TextInputProps, 'style'> {
	label?: string;
	placeholder?: string;
	value?: string;
	onChangeText?: (text: string) => void;

	leftIcon?: ImageSourcePropType;
	rightIcon?: ImageSourcePropType;
	onRightIconPress?: () => void;

	isFocused?: boolean;
	error?: string | null;
	disabled?: boolean;

	secureTextEntry?: boolean;
	keyboardType?: KeyboardTypeOptions;
	returnKeyType?: ReturnKeyTypeOptions;
	autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
	autoComplete?: TextInputProps['autoComplete'];
	textContentType?: TextInputProps['textContentType'];

	multiline?: boolean;
	numberOfLines?: number;
	maxLength?: number;

	containerStyle?: ViewStyle;
	inputStyle?: TextStyle;
	variant?: 'default' | 'outlined' | 'filled';
	size?: 'small' | 'medium' | 'large';
	roundedFull?: boolean;
	bgColor?: string;

	onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
	onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
	onSubmitEditing?: () => void;

	accessibilityLabel?: string;
	accessibilityHint?: string;

	required?: boolean;
	showCharacterCount?: boolean;
}

const CustomInputField = forwardRef<TextInput, InputFieldProps>(
	(
		{
			label,
			placeholder,
			value = '',
			onChangeText,
			leftIcon,
			rightIcon,
			onRightIconPress,
			isFocused = false,
			error,
			bgColor,
			roundedFull = false,
			disabled = false,
			secureTextEntry = false,
			keyboardType = 'default',
			returnKeyType = 'done',
			autoCapitalize = 'sentences',
			autoComplete,
			textContentType,
			multiline = false,
			numberOfLines = 1,
			maxLength,
			containerStyle,
			inputStyle,
			size = 'medium',
			onFocus,
			onBlur,
			onSubmitEditing,
			accessibilityLabel,
			accessibilityHint,
			required = false,
			showCharacterCount = false,
			...otherProps
		},
		ref
	) => {
		const [internalFocus, setInternalFocus] = useState(false);
		const [showPassword, setShowPassword] = useState(false);
		const { colorScheme } = useColorScheme();
		const isDark = colorScheme === 'dark';

		const isActuallyFocused = isFocused || internalFocus;
		const hasError = Boolean(error);

		const sizeConfig = {
			small: { height: 44, fontSize: 14, iconSize: 18, padding: 12 },
			medium: { height: 52, fontSize: 14, iconSize: 20, padding: 12 },
			large: { height: 60, fontSize: 18, iconSize: 22, padding: 16 },
		};
		const currentSize = sizeConfig[size];

		const getIconColor = (): string => {
			if (disabled) return '#9CA3AF';
			if (hasError) return '#EF4444';
			if (isActuallyFocused)
				return isDark ? COLORS.light.pallete[500] : COLORS.light.pallete[600];
			return '#6B7280';
		};

		const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
			setInternalFocus(true);
			onFocus?.(e);
		};
		const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
			setInternalFocus(false);
			onBlur?.(e);
		};

		const togglePasswordVisibility = () => setShowPassword(!showPassword);
		const handleRightIconPress = () => {
			if (secureTextEntry) togglePasswordVisibility();
			else onRightIconPress?.();
		};
		const getRightIcon = () =>
			secureTextEntry ? (showPassword ? icons.eyecross : icons.eye) : rightIcon;

		const showRightIcon = secureTextEntry || rightIcon;

		return (
			<View style={[{ marginBottom: 16 }, containerStyle]}>
				{/* Label */}
				{label && (
					<View className="flex-row items-center mb-2">
						<Text className="text-body-sm text-gray-700 dark:text-gray-300">
							{label}
						</Text>
						{required && <Text className="text-red-500 ml-1">*</Text>}
					</View>
				)}

				{/* Input Container */}
				<View
					className={`flex-row items-center border
					${multiline ? 'items-start' : ''} 
					${
						disabled
							? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-90'
							: hasError
							? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
							: isActuallyFocused
							? 'bg-light-pallete-50/50 dark:bg-light-pallete-900/20 border-light-pallete-500  dark:border-light-pallete-600'
							: 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
					}`}
					style={{
						height: multiline ? undefined : currentSize.height,
						// backgroundColor: bgColor ?? '',
						borderRadius: roundedFull ? 999 : 12,
					}}
				>
					{/* Left Icon */}
					{leftIcon && (
						<View
							style={{ paddingLeft: roundedFull ? 12 : 8, paddingRight: 8 }}
							pointerEvents="none"
						>
							<Image
								source={leftIcon}
								className="w-5 h-5"
								tintColor={getIconColor()}
							/>
						</View>
					)}

					{/* Text Input */}
					<TextInput
						ref={ref}
						className={`flex-1 ${
							disabled
								? 'text-gray-400 dark:text-gray-500'
								: hasError
								? 'text-red-600 dark:text-red-400'
								: 'text-gray-900 dark:text-white'
						} `}
						style={[
							{
								fontSize: currentSize.fontSize,
								paddingHorizontal: leftIcon ? 4 : currentSize.padding,
								paddingVertical: multiline ? 12 : 0,
								minHeight: multiline ? 70 : currentSize.height - 4,
								textAlignVertical: multiline ? 'top' : 'center',
								flex: 1,
								backgroundColor: 'transparent',
								fontFamily: 'Nexa-400',
							},
							inputStyle, //styles to overide default behavior
						]}
						placeholder={placeholder}
						placeholderTextColor={
							disabled ? '#9CA3AF' : hasError ? '#F87171' : '#9CA3AF'
						}
						value={value}
						onChangeText={onChangeText}
						onFocus={handleFocus}
						onBlur={handleBlur}
						onSubmitEditing={onSubmitEditing}
						secureTextEntry={secureTextEntry && !showPassword}
						keyboardType={keyboardType}
						returnKeyType={returnKeyType}
						autoCapitalize={autoCapitalize}
						autoComplete={autoComplete}
						textContentType={textContentType}
						multiline={multiline}
						numberOfLines={multiline ? numberOfLines : 1}
						maxLength={maxLength}
						editable={!disabled}
						selectTextOnFocus={!disabled}
						accessibilityLabel={accessibilityLabel || placeholder}
						accessibilityHint={accessibilityHint}
						{...otherProps}
					/>

					{/* Right Icon */}
					{showRightIcon && (
						<TouchableOpacity
							style={{ paddingHorizontal: 10 }}
							onPress={handleRightIconPress}
							disabled={disabled}
							accessible={true}
							accessibilityRole="button"
							accessibilityLabel={
								secureTextEntry
									? `${showPassword ? 'Hide' : 'Show'} password`
									: 'Right icon button'
							}
						>
							<Image
								source={getRightIcon()}
								className="w-6 h-6"
								tintColor={getIconColor()}
							/>
						</TouchableOpacity>
					)}
				</View>

				{/* Error Message */}
				{hasError && (
					<View className="flex-row items-center mt-[4px] px-1">
						<Ionicons
							name="alert-circle"
							size={12}
							color="#EF4444"
							style={{ marginRight: 4 }}
						/>
						<Text className="text-body-xs text-red-600 dark:text-red-500 flex-1">
							{error}
						</Text>
					</View>
				)}

				{/* Character Count */}
				{showCharacterCount && maxLength && (
					<View className="flex-row justify-end mt-1 px-1">
						<Text
							className={`text-xs ${
								value.length > maxLength * 0.8
									? 'text-orange-500 dark:text-orange-400'
									: value.length === maxLength
									? 'text-red-500 dark:text-red-400'
									: 'text-gray-500 dark:text-gray-400'
							}`}
						>
							{value.length}/{maxLength}
						</Text>
					</View>
				)}

				{/* Helper Text */}
				{!hasError && accessibilityHint && (
					<Text className="text-body-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
						{accessibilityHint}
					</Text>
				)}
			</View>
		);
	}
);

CustomInputField.displayName = 'CustomInputField';
export default CustomInputField;
