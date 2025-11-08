// import { useTheme } from '@/hooks/useTheme';
import CustomHeader from '@/components/CustomHeader';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { Platform, View } from 'react-native';

export default function ScanLayout() {
	// const { colors } = useTheme();

	const rednerIcon = (src: string) => {
		return (
			<View className="w-[40px] h-[40px] dark:bg-gray-900 rounded-full items-center justify-center dark:border dark:border-gray-800">
				<Ionicons
					name={src as any} //TODO: Change type
					size={24}
					color={COLORS.gray[950]}
				/>
			</View>
		);
	};

	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: '#FFFFFF',
				},
				headerTintColor: '#000000',
				headerTitleStyle: {
					fontFamily: 'Nexa-Heavy',
					fontSize: 20,
				},
				headerShadowVisible: false,
				gestureEnabled: Platform.OS !== 'web',
				animation: 'slide_from_right',
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					header: () => (
						<CustomHeader
							title="Search by taking photos"
							iconRight={
								<Ionicons name="help-circle-outline" size={24} color="#000" />
							}
							iconLeft={rednerIcon('chevron-back-outline')}
							onIconLeftPress={() => {
								router.back();
							}}
						/>
					),
				}}
				// options={{
				// 	headerTitle: 'Plant Scanner',
				// 	headerLeft: () => (
				// 		<TouchableOpacity
				// 			onPress={() => {
				// 				Haptics.selectionAsync();
				// 				// router.replace('/(root)/(tabs)/home');
				// 			}}
				// 			style={{ marginLeft: 10 }}
				// 		>
				// 			<Ionicons name="close" size={24} color={'#000000'} />
				// 		</TouchableOpacity>
				// 	),
				// }}
			/>
		</Stack>
	);
}
