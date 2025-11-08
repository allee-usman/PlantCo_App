import { InputFieldProps } from '@/interfaces/interface';
import { useTheme } from '@/utils/theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import React from 'react';
import {
	Text,
	TextInput,
	TextInputProps,
	TouchableOpacity,
	View,
} from 'react-native';

const InputField: React.FC<InputFieldProps> = (props) => {
	const theme = useTheme();
	const isDarkMode = theme === 'dark';

	const getBorderStyle = () => {
		if (props.error) {
			return 'border-red-500 dark:border-red-600'; // Error state - red border
		}
		if (props.isFocused) {
			return 'border-light-accent dark:border-dark-accent'; // Focused state - accent border
		}
		return 'border-gray-200 dark:border-gray-700'; // Default state
	};

	const getIconColor = () => {
		if (props.error) {
			return '#e53935'; // Red color for error state
		}
		return '#71717a'; // Default gray color
	};

	const placeholderColor = props.error
		? '#ef5350'
		: isDarkMode
		? '#71717a'
		: '#a1a1aa';

	const inputTextClasses = clsx([
		'ml-2 flex-1 text-gray-700',
		props.error && 'text-red-600',
	]);

	return (
		<View className="mb-4">
			<View className={`input border-[1.5px] ${getBorderStyle()}`}>
				{/* Start Icon */}
				{props.leftIcon && (
					<Ionicons
						name={props.leftIcon as keyof typeof Ionicons.glyphMap}
						size={20}
						color={getIconColor()}
					/>
				)}

				{/* TextInput */}
				<TextInput
					className={inputTextClasses}
					placeholder={props.placeholder}
					placeholderTextColor={placeholderColor}
					value={props.value}
					onChangeText={props.onChangeText}
					secureTextEntry={props.secureTextEntry ?? false}
					editable={props.editable ?? true}
					autoCapitalize={props.autoCapitalize ?? 'none'}
					keyboardType={props.keyboardType ?? 'default'}
					returnKeyType={props.returnKeyType ?? 'done'}
					textContentType={
						props.textContentType as TextInputProps['textContentType']
					}
					autoComplete={props.autoComplete as TextInputProps['autoComplete']}
					onBlur={props.onBlur}
					onSubmitEditing={props.onSubmitEditing}
					accessibilityLabel={props.accessibilityLabel}
					ref={props.inputRef}
					onFocus={props.onFocus}
					style={{
						color: `${
							props.error ? '#ef5350' : isDarkMode ? '#d4d4d8' : '#52525b'
						}`,
						fontFamily: 'Nexa-400',
					}}
					cursorColor={isDarkMode ? '#00a377' : '#4d7111'}
					selectionColor={isDarkMode ? '#00a377' : '#effbcc'}
				/>

				{/* End Icon */}
				{props.rightIcon && (
					<TouchableOpacity
						onPress={() => {
							if (props.onRightIconPress) props.onRightIconPress();
						}}
						accessibilityLabel={props.rightIconAccessibleLabel}
						className="ml-2"
					>
						<Ionicons
							name={props.rightIcon as keyof typeof Ionicons.glyphMap}
							size={20}
							color={getIconColor()}
						/>
					</TouchableOpacity>
				)}
			</View>

			{/* Error Text */}
			{props.error && (
				<View className="mt-2 ml-2 flex flex-row items-center">
					<Ionicons name="alert-circle" size={13} color="#dc2626" />
					<Text className="text-xs font-nexa text-red-600 ml-1">
						{props.error}
					</Text>
				</View>
			)}
		</View>
	);
};

export default InputField;
