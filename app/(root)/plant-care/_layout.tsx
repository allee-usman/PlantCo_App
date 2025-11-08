import CustomHeader from '@/components/CustomHeader';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Platform, TouchableOpacity } from 'react-native';
// import { useTheme } from '@/hooks/useTheme';

export default function ServicesLayout() {
	// const { colors } = useTheme();
	const router = useRouter();

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
				name="service/[id]"
				options={{
					headerTitle: 'Service Details',
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
				name="booking/[id]"
				options={{
					headerTitle: 'Book Service',
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
		</Stack>
	);
}
