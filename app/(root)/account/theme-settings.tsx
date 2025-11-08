// src/screens/ThemeSettings.tsx
import { images } from '@/constants/images';
import { useAppTheme } from '@/hooks/ThemeProvider';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const ThemeOption: React.FC<{
	label: string;
	value: 'system' | 'light' | 'dark';
	selected: boolean;
	onPress: () => void;
}> = ({ label, value, selected, onPress }) => {
	const getImage = () => {
		switch (value) {
			case 'light':
				return images.light;
			case 'dark':
				return images.dark;
			default:
				return images.system;
		}
	};

	return (
		<TouchableOpacity onPress={onPress} className="items-center flex-1 mx-2">
			{/* Preview Box */}

			<View
				className={`rounded-2xl mb-2 border-[1.75px] ${
					selected
						? 'border-light-pallete-500 dark:border-light-pallete-400'
						: 'border-transparent'
				}`}
			>
				<Image
					source={getImage()}
					className="w-[66px] h-[118px] rounded-xl m-[4px]"
					resizeMode="cover"
				/>
			</View>

			{/* Label */}
			<Text className="text-body-sm font-nexa-bold text-gray-900 dark:text-white text-center">
				{label}
			</Text>
		</TouchableOpacity>
	);
};

export default function ThemeSettings() {
	const { preference, setPreference, ready } = useAppTheme();

	if (!ready)
		return (
			<View className="flex-1 items-center justify-center">
				<Text>Loading...</Text>
			</View>
		);

	return (
		<View className="flex-1 bg-light-screen dark:bg-gray-950 px-5 py-6">
			<View className="rounded-xl justify-between mb-6 bg-light-surface dark:bg-gray-800 py-4 ">
				<Text className="font-nexa-bold text-lg text-gray-950 dark:text-white mb-4 px-5 tracking-wider">
					Mode
				</Text>
				<View className="flex-row justify-between items-center pb-10 ">
					<ThemeOption
						label="System"
						value="system"
						selected={preference === 'system'}
						onPress={() => setPreference('system')}
					/>
					<ThemeOption
						label="Light"
						value="light"
						selected={preference === 'light'}
						onPress={() => setPreference('light')}
					/>
					<ThemeOption
						label="Dark"
						value="dark"
						selected={preference === 'dark'}
						onPress={() => setPreference('dark')}
					/>
				</View>
			</View>
		</View>
	);
}
