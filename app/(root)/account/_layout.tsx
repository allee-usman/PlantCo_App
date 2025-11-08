import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Platform, View } from 'react-native';
// import { useTheme } from '@/hooks/useTheme';
import CustomHeader from '@/components/CustomHeader';
import { COLORS } from '@/constants/colors';
import { useColorScheme } from 'nativewind';

export default function AccountLayout() {
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
				headerShadowVisible: false,
				gestureEnabled: Platform.OS !== 'web',
				animation: 'slide_from_right',
			}}
		>
			{/* Account Main Screen */}
			<Stack.Screen
				name="index"
				options={{
					header: () => (
						<CustomHeader
							title="Account"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderIcon('chevron-back-outline')}
						/>
					),
				}}
			/>

			{/* Profile Section */}
			<Stack.Screen
				name="profile"
				options={{
					headerShown: false,
				}}
			/>

			{/* My Bookings - headerShown: false since it has its own layout */}
			<Stack.Screen
				name="my-bookings"
				options={{
					headerShown: false,
				}}
			/>

			{/* Order History */}
			<Stack.Screen
				name="order-history"
				options={{
					header: () => (
						<CustomHeader
							title="Order History"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderIcon('chevron-back-outline')}
							iconRight={renderIcon('filter-outline')}
							onIconRightPress={() => {
								// Handle filter options
								console.log('Filter orders');
							}}
						/>
					),
				}}
			/>

			{/* Wishlist */}
			<Stack.Screen
				name="wishlist"
				options={{
					header: () => (
						<CustomHeader
							title="My Wishlist"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderIcon('chevron-back-outline')}
						/>
					),
				}}
			/>
			{/* Transactions */}
			<Stack.Screen
				name="transactions"
				options={{
					header: () => (
						<CustomHeader
							title="Transactions"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderIcon('chevron-back-outline')}
						/>
					),
				}}
			/>

			{/* Addresses - headerShown: false since it has its own layout */}
			<Stack.Screen
				name="addresses"
				options={{
					headerShown: false,
				}}
			/>

			{/* Payment Methods */}
			<Stack.Screen
				name="payments"
				options={{
					headerShown: false, // Let payments handle its own layout
				}}
			/>

			{/* Settings/Notifications */}
			<Stack.Screen
				name="settings"
				options={{
					header: () => (
						<CustomHeader
							title="Settings"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderIcon('chevron-back-outline')}
						/>
					),
				}}
			/>

			{/* Help & Support */}
			<Stack.Screen
				name="help"
				options={{
					header: () => (
						<CustomHeader
							title="Help & Support"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderIcon('chevron-back-outline')}
						/>
					),
				}}
			/>

			{/* FAQs */}
			<Stack.Screen
				name="faqs"
				options={{
					header: () => (
						<CustomHeader
							title="FAQs"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderIcon('chevron-back-outline')}
							iconRight={renderIcon('search-outline')}
							onIconRightPress={() => {
								// Handle FAQ search
								console.log('Search FAQs');
							}}
						/>
					),
				}}
			/>
			{/* app appearence */}
			<Stack.Screen
				name="theme-settings"
				options={{
					header: () => (
						<CustomHeader
							title="App Appearence"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderIcon('chevron-back-outline')}
						/>
					),
				}}
			/>

			{/* chnage email */}
			<Stack.Screen
				name="change-email"
				options={{
					header: () => (
						<CustomHeader
							title="Update"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderIcon('chevron-back-outline')}
						/>
					),
				}}
			/>
			{/* chnage password */}
			<Stack.Screen
				name="change-password"
				options={{
					header: () => (
						<CustomHeader
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderIcon('chevron-back-outline')}
						/>
					),
				}}
			/>

			{/* Legal Information */}
			<Stack.Screen
				name="legal-information"
				options={{
					headerShown: false, // Let legal handle its own nested layout
				}}
			/>
		</Stack>
	);
}
