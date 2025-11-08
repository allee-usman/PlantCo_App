import CustomHeader from '@/components/CustomHeader';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Platform, View } from 'react-native';

export default function LegalInformationLayout() {
	const router = useRouter();
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';
	const renderLeftIcon = (src: string) => {
		return (
			<View className="w-[40px] h-[40px] bg-gray-50 dark:bg-gray-900 rounded-full items-center justify-center border border-gray-200 dark:border-gray-800">
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
			// initialRouteName="index"

			screenOptions={{
				gestureEnabled: Platform.OS !== 'web',
				contentStyle: { backgroundColor: '#030712' },
				// cardStyle: { backgroundColor: '#030712' },
				animation: 'slide_from_right',
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					header: () => (
						<CustomHeader
							title="Legal Information"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderLeftIcon('chevron-back-outline')}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="terms-of-service"
				options={{
					header: () => (
						<CustomHeader
							title="Terms of Service"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderLeftIcon('chevron-back-outline')}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="privacy-policy"
				options={{
					header: () => (
						<CustomHeader
							title="Privacy Policy"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderLeftIcon('chevron-back-outline')}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="cookie-policy"
				options={{
					header: () => (
						<CustomHeader
							title="Cookie Policy"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderLeftIcon('chevron-back-outline')}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="refund-policy"
				options={{
					header: () => (
						<CustomHeader
							title="Return & Refund Policy"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderLeftIcon('chevron-back-outline')}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="shipping-policy"
				options={{
					header: () => (
						<CustomHeader
							title="Shipping Policy"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderLeftIcon('chevron-back-outline')}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="data-protection"
				options={{
					header: () => (
						<CustomHeader
							title="Data Protection"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderLeftIcon('chevron-back-outline')}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="intellectual-property"
				options={{
					header: () => (
						<CustomHeader
							title="Intellectual Property"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderLeftIcon('chevron-back-outline')}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="community-guidelines"
				options={{
					header: () => (
						<CustomHeader
							title="Community Guidelines"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderLeftIcon('chevron-back-outline')}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="dispute-resolution"
				options={{
					header: () => (
						<CustomHeader
							title="Dispute Resolution"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderLeftIcon('chevron-back-outline')}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="contact-legal"
				options={{
					header: () => (
						<CustomHeader
							title="Contact Legal Team"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderLeftIcon('chevron-back-outline')}
						/>
					),
				}}
			/>
		</Stack>
	);
}
