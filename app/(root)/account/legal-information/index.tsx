import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Pressable, ScrollView, StatusBar, Text, View } from 'react-native';

interface LegalItem {
	id: string;
	title: string;
	icon: keyof typeof Ionicons.glyphMap;
	onPress: () => void;
}

export default function LegalInformationScreen() {
	const legalItems: LegalItem[] = [
		{
			id: '1',
			title: 'Terms of Service',
			icon: 'document-text-outline',
			onPress: () => router.push('/account/legal-information/terms-of-service'),
		},
		{
			id: '2',
			title: 'Privacy Policy',
			icon: 'shield-checkmark-outline',
			onPress: () => router.push('/account/legal-information/privacy-policy'),
		},
		{
			id: '3',
			title: 'Cookie Policy',
			icon: 'settings-outline',
			onPress: () => router.push('/account/legal-information/cookie-policy'),
		},
		{
			id: '4',
			title: 'Return & Refund Policy',
			icon: 'return-up-back-outline',
			onPress: () => router.push('/account/legal-information/refund-policy'),
		},
		{
			id: '5',
			title: 'Shipping Policy',
			icon: 'car-outline',
			onPress: () => router.push('/account/legal-information/shipping-policy'),
		},
		{
			id: '6',
			title: 'Data Protection',
			icon: 'lock-closed-outline',
			onPress: () => router.push('/account/legal-information/data-protection'),
		},
		{
			id: '7',
			title: 'Intellectual Property',
			icon: 'bulb-outline',
			onPress: () =>
				router.push('/account/legal-information/intellectual-property'),
		},
		{
			id: '8',
			title: 'Community Guidelines',
			icon: 'people-outline',
			onPress: () =>
				router.push('/account/legal-information/community-guidelines'),
		},
		{
			id: '9',
			title: 'Dispute Resolution',
			icon: 'hammer-outline',
			onPress: () =>
				router.push('/account/legal-information/dispute-resolution'),
		},
		{
			id: '10',
			title: 'Contact Legal Team',
			icon: 'mail-outline',
			onPress: () => router.push('/account/legal-information/contact-legal'),
		},
	];

	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';
	return (
		<ScrollView
			className="flex-1 bg-light-screen dark:bg-gray-950"
			showsVerticalScrollIndicator={false}
		>
			<StatusBar
				backgroundColor="transparent"
				barStyle={isDark ? 'light-content' : 'dark-content'}
			/>

			<View className="px-5 py-4">
				{/* Header Description */}
				<Text className="text-gray-600 dark:text-gray-300 font-nexa text-sm leading-5 mb-6">
					Review our legal policies and terms that govern the use of SmartMart.
					These documents outline your rights and responsibilities when using
					our platform.
				</Text>

				{/* Legal Items List */}
				<View className="space-y-2">
					{legalItems.map((item) => (
						<Pressable
							key={item.id}
							onPress={item.onPress}
							className="flex-row mb-2 items-center justify-between p-4 bg-light-surface dark:bg-gray-800 rounded-lg active:bg-gray-100 dark:active:bg-gray-700"
						>
							<View className="flex-row items-center flex-1">
								<View className="w-10 h-10 bg-light-pallete-50 dark:bg-green-900/20 rounded-full items-center justify-center mr-3">
									<Ionicons
										name={item.icon}
										size={20}
										color={COLORS.light.pallete[500]}
									/>
								</View>
								<Text className="text-gray-900 dark:text-white font-nexa-bold text-base flex-1">
									{item.title}
								</Text>
							</View>
							<Ionicons name="chevron-forward" size={20} color="#6B7280" />
						</Pressable>
					))}
				</View>

				{/* Important Notice */}
				<View className="mt-6 p-4 bg-yellow-50 dark:bg-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
					<View className="flex-row items-start">
						<Ionicons
							name="warning-outline"
							size={20}
							color="#F59E0B"
							style={{ marginTop: 2, marginRight: 8 }}
						/>
						<View className="flex-1">
							<Text className="text-yellow-800 dark:text-yellow-200 font-nexa-bold text-sm mb-1">
								Important Notice
							</Text>
							<Text className="text-yellow-700 dark:text-yellow-300 font-nexa text-xs leading-4">
								These legal documents are regularly updated. Please review them
								periodically to stay informed about any changes that may affect
								your use of SmartMart.
							</Text>
						</View>
					</View>
				</View>

				{/* Last Updated */}
				<View className="mt-2 p-3 rounded-lg">
					<Text className="text-gray-600 dark:text-gray-400 font-nexa text-xs text-center">
						Last Updated: January 15, 2025
					</Text>
				</View>

				{/* Contact Information */}
				<View className="mt-4 mb-5 p-4 bg-blue-100 dark:bg-green-900/20 rounded-lg">
					<Text className="text-blue-900 dark:text-green-200 font-nexa-extrabold text-body mb-2">
						Legal Questions?
					</Text>
					<Text className="text-blue-700 leading-5 dark:text-green-100 font-nexa text-sm mb-2">
						For legal inquiries or concerns, contact our legal team:
					</Text>
					<Text className="text-blue-800 dark:text-green-100 font-nexa-extrabold text-sm">
						Email: legal@plantco.com
					</Text>
					<Text className="text-blue-800 dark:text-green-100 font-nexa-extrabold text-sm">
						Phone: +92-316-6183522
					</Text>
				</View>
			</View>
		</ScrollView>
	);
}
