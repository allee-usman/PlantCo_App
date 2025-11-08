import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Platform, TouchableOpacity } from 'react-native';
// import { useTheme } from '@/hooks/useTheme';
import { COLORS } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { View } from 'moti';
import { useColorScheme } from 'nativewind';

export default function HomeLayout() {
	// const { colors } = useTheme();
	const router = useRouter();
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	const renderLeftIcon = (src: string) => {
		return (
			<View className="w-[40px] h-[40px] bg-light-surface dark:bg-gray-900 rounded-full items-center justify-center border border-gray-200 dark:border-gray-800">
				<Ionicons
					name={src as any} //TODO: Change type
					size={24}
					color={isDark ? COLORS.gray[100] : COLORS.gray[950]}
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
					headerShown: false,
					headerRight: () => (
						<TouchableOpacity
							onPress={() => {
								Haptics.selectionAsync();
								// router.push('/(root)/(tabs)/home/search');
							}}
							style={{ marginRight: 10 }}
						>
							<Ionicons name="search" size={24} color={'#000000'} />
						</TouchableOpacity>
					),
				}}
			/>
			<Stack.Screen
				name="search"
				options={{
					headerTitle: 'Search Plants',
					headerLeft: () => (
						<TouchableOpacity
							onPress={() => router.back()}
							style={{ marginLeft: 10 }}
						>
							<Ionicons name="arrow-back" size={24} color={'#000000'} />
						</TouchableOpacity>
					),
				}}
			/>
			<Stack.Screen
				name="message"
				options={{
					headerTitle: 'Messages',
					headerLeft: () => (
						<TouchableOpacity
							onPress={() => router.back()}
							style={{ marginLeft: 10 }}
						>
							<Ionicons name="arrow-back" size={24} color={'#000000'} />
						</TouchableOpacity>
					),
				}}
			/>
			<Stack.Screen
				name="notifications"
				options={{
					headerTitle: 'Notifications',
					headerLeft: () => (
						<TouchableOpacity
							onPress={() => router.back()}
							style={{ marginLeft: 10 }}
						>
							<Ionicons name="arrow-back" size={24} color={'#000000'} />
						</TouchableOpacity>
					),
				}}
			/>
			<Stack.Screen
				name="category/[id]"
				options={{
					headerShown: false,
				}}
			/>
			{/* <Stack.Screen
				name="product/[id]"
				options={{
					header: () => (
						<CustomHeader
							title="Prodcut Details"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderLeftIcon('chevron-back-outline')}
							style={{ backgroundColor: 'transparent' }}
						/>
					),
				}}
			/> */}
			<Stack.Screen
				name="product/[id]"
				options={{
					headerShown: false, // 👈 hides the header completely
				}}
			/>
		</Stack>
	);
}
