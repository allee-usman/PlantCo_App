import CustomHeader from '@/components/CustomHeader';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Platform, TouchableOpacity, View } from 'react-native';
// import { useTheme } from '@/hooks/useTheme';

export default function ServicesLayout() {
	// const { colors } = useTheme();
	const router = useRouter();
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	const renderIcon = (src: string) => {
		return (
			<View className="w-[40px] h-[40px] rounded-full items-center justify-center">
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
				}}
			/>
			<Stack.Screen
				name="search"
				options={{
					header: () => (
						<CustomHeader
							title="Forgot Password"
							iconLeft={
								<TouchableOpacity
									onPress={() => {
										// Haptics.selectionAsync();
										// router.replace('/(auth)/signin');
									}}
									style={{ marginLeft: 10 }}
								>
									<Ionicons name="arrow-back" size={24} color="#000000" />
								</TouchableOpacity>
							}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="category/[slug]"
				options={{
					headerTitle: 'Service Category',
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
				name="service/[serviceId]"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="booking/[serviceId]"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="booking/confirmation"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="profile/[providerId]"
				options={{
					headerShown: false,
				}}
			/>
		</Stack>
	);
}
