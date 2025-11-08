import ContactModal from '@/components/ContactModal';
import CustomButton from '@/components/CustomButton';
import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';
import { Image, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Help = () => {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';
	const [showModal, setShowModal] = useState<boolean>(false);
	return (
		<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950 items-center justify-center px-5 pb-6">
			<StatusBar
				backgroundColor="transparent"
				barStyle={isDark ? 'light-content' : 'dark-content'}
			/>
			<View className="flex-1 items-center justify-center">
				<View className="mb-12">
					<Image
						source={icons.help}
						className="w-[100px] h-[100px]"
						style={{
							tintColor: isDark
								? COLORS.light.pallete[400]
								: COLORS.light.pallete[500],
						}}
					/>
				</View>
				<Text className="text-xl font-nexa-heavy text-gray-950 dark:text-gray-100">
					Need Assistance?
				</Text>
				<Text className="text-xl font-nexa-heavy text-gray-950 dark:text-gray-100">
					We&apos;re here to Help
				</Text>
				<Text className="text-body-sm font-nexa dark:text-gray-500 text-gray-400 text-center mt-3 px-3">
					Our team is here for you. Just reach out, and we&apos;ll take care of
					you along with your plants.
				</Text>
			</View>
			<ContactModal visible={showModal} onClose={() => setShowModal(false)} />
			<View className="w-full">
				<CustomButton
					label="Contact us"
					bgVariant="primary"
					textVariant="primary"
					className="w-full"
					onPress={() => setShowModal(true)}
				/>
			</View>
		</SafeAreaView>
	);
};

export default Help;
