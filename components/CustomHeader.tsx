import React, { ReactNode } from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CustomHeaderProps {
	title?: string;
	iconLeft?: ReactNode;
	iconRight?: ReactNode;
	onIconLeftPress?: () => void;
	onIconRightPress?: () => void;
	style?: ViewStyle;
}

export default React.memo(function CustomHeader({
	title,
	iconLeft,
	iconRight,
	onIconLeftPress,
	onIconRightPress,
	style,
}: CustomHeaderProps) {
	return (
		<SafeAreaView
			className="bg-light-screen dark:bg-gray-950"
			edges={['top']}
			style={style}
		>
			{/* <SafeAreaView
			edges={['top']}
			className="dark:bg-gray-950 bg-light-screen"
			style={style}
		> */}
			<View className="flex-row items-center justify-between px-5 py-3">
				<TouchableOpacity
					onPress={onIconLeftPress}
					activeOpacity={0.6}
					disabled={!onIconLeftPress}
					accessibilityRole="button"
					accessibilityLabel="Back"
				>
					{iconLeft}
				</TouchableOpacity>

				<Text className="flex-1 text-center text-body tracking-wider font-nexa-extrabold text-black dark:text-white">
					{title}
				</Text>

				<TouchableOpacity
					onPress={onIconRightPress}
					activeOpacity={0.6}
					disabled={!onIconLeftPress}
					accessibilityRole="button"
					accessibilityLabel="Back"
				>
					{iconRight ? iconRight : <View className="w-[40px] h-[40px]" />}
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
});
