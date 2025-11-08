import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
	Pressable,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

interface DropdownProps {
	label?: string;
	options: string[];
	value: string;
	onSelect: (val: string) => void;
	error?: string | null;
	required?: boolean;
	isFocused?: boolean; // new
	onOpen?: () => void; // new
	onClose?: () => void; // new
}

const CustomDropdown: React.FC<DropdownProps> = ({
	label,
	options,
	value,
	onSelect,
	error,
	required,
	isFocused = false,
	onOpen,
	onClose,
}) => {
	const [open, setOpen] = useState(false);

	const toggleDropdown = () => {
		if (!open) {
			onOpen?.();
		} else {
			onClose?.();
		}
		setOpen(!open);
	};

	const hasError = Boolean(error);
	const isActuallyFocused = isFocused || open;

	return (
		<View className="mb-4 relative">
			{label && (
				<View className="flex-row items-center mb-2">
					<Text className="text-body-sm text-gray-700 dark:text-gray-300">
						{label}
					</Text>
					{required && <Text className="text-red-500 ml-1">*</Text>}
				</View>
			)}
			<TouchableOpacity onPress={toggleDropdown} activeOpacity={0.7}>
				<View
					className={`flex-row items-center px-3 py-4 rounded-xl border ${
						hasError
							? 'border-red-500 bg-red-50 dark:bg-red-900/20'
							: isActuallyFocused
							? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
							: 'border-gray-200 dark:border-gray-700 bg-light-surface dark:bg-gray-800'
					}`}
				>
					<Text
						className={`flex-1 text-body-sm ${
							value ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'
						}`}
					>
						{value || label}
					</Text>
					<Ionicons
						name={open ? 'chevron-up' : 'chevron-down'}
						size={20}
						color="#71717a"
					/>
				</View>
			</TouchableOpacity>

			{open && (
				<>
					{/* Overlay to close on outside press */}
					<Pressable
						className="absolute inset-0"
						onPress={() => {
							setOpen(false);
							onClose?.();
						}}
					/>

					<View className="absolute top-full left-0 right-0 z-20 bg-light-surface dark:bg-gray-800 rounded-2xl mt-1 border border-gray-200 dark:border-gray-700 max-h-64">
						<ScrollView className="py-2" nestedScrollEnabled>
							{options.map((opt) => (
								<TouchableOpacity
									key={opt}
									className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 ${
										opt === value ? 'bg-gray-100 dark:bg-gray-700' : ''
									}`}
									onPress={() => {
										onSelect(opt);
										setOpen(false);
										onClose?.();
									}}
								>
									<Text className="text-body text-light-title dark:text-dark-title">
										{opt}
									</Text>
								</TouchableOpacity>
							))}
						</ScrollView>
					</View>
				</>
			)}

			{/* Error message */}
			{error && (
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
		</View>
	);
};

export default CustomDropdown;
