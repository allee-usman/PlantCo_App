import CustomButton from '@/components/CustomButton';
import { icons } from '@/constants/icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Success = () => {
	return (
		<SafeAreaView className="flex-1 justify-center gap-y-6 items-center py-4 px-4 bg-light-screen dark:bg-gray-950">
			<Image source={icons.thankyou} className="w-[120px] h-[120px]" />
			<View className="gap-y-1 justify-center items-center">
				<Text className="text-xl font-nexa-heavy text-light-pallete-800 dark:text-light-pallete-200">
					Thank you for Purchase!
				</Text>
				<Text className="text-body-sm text-center px-4 text-gray-500 dark:text-gray-400">
					Your order has been successfully placed{'/n'}and is on its way to you
					soon.
				</Text>
			</View>
			<CustomButton
				label="Continue Shopping"
				bgVariant="primary"
				className="py-5 px-4 w-[200px]"
				onPress={() => router.replace('/home')}
			/>
		</SafeAreaView>
	);
};

export default Success;
