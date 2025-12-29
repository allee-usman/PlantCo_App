import CustomButton from '@/components/CustomButton';
import LottieLoadingIndicator from '@/components/LottieLoadingIndicator';
import { COLORS } from '@/constants/colors';
import { onboarding } from '@/constants/onboarding';
import { OnboardingItem } from '@/interfaces/interface';
import { getSecureItem, saveSecureItem } from '@/utils/secureStore';
import { Redirect, router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	Dimensions,
	Image,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwiperFlatList } from 'react-native-swiper-flatlist';

const { width } = Dimensions.get('window');

export default function Onboarding() {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';
	const swiperRef = useRef<SwiperFlatList>(null);
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const isLastPage = activeIndex === onboarding.length - 1;

	const [loading, setLoading] = useState(true);
	const [shouldRedirect, setShouldRedirect] = useState(false);

	const handleContinue = async () => {
		await saveSecureItem('hasSeenOnboarding', 'true');
		router.replace('/(auth)/signup');
	};
	const handleNext = () => {
		swiperRef.current?.scrollToIndex({
			index: activeIndex + 1,
			animated: true,
		});
	};

	const dotElem = useMemo(
		() => ({
			width: 10,
			height: 10,
			backgroundColor: '#d1d5db',
			borderRadius: 999,
			marginHorizontal: 4,
		}),
		[]
	);

	const activeDotElem = useMemo(
		() => ({
			width: 20,
			height: 10,
			backgroundColor: isDark
				? COLORS.light.pallete[300]
				: COLORS.light.pallete[300],
			borderRadius: 999,
			marginHorizontal: 4,
		}),
		[isDark]
	);

	useEffect(() => {
		(async () => {
			const hasSeenOnboarding = await getSecureItem('hasSeenOnboarding');
			if (hasSeenOnboarding === 'true') {
				setShouldRedirect(true);
			}
			setLoading(false);
		})();
	}, []);

	if (loading) return <LottieLoadingIndicator />;
	if (shouldRedirect) return <Redirect href="/(auth)/login" />;

	const lastPage = (item: OnboardingItem) => (
		<View key={item.id} className="flex flex-col pl-5 h-full">
			<Text className="ml-1 text-title-variant  mb-2 mt-6 px-3">
				{item.title}
			</Text>
			<Text className="text-body leading-6 w-[200px] mx-6 mb-2">
				{item.description}
			</Text>
			<View className="flex-1 relative">
				<Image
					source={item.image}
					className="absolute -right-[50%] bottom-[10%] h-[100%]"
					resizeMode="contain"
					accessibilityLabel={item.title}
				/>
			</View>
		</View>
	);

	const content = onboarding.map((item, index) => {
		if (index === onboarding.length - 1) {
			return lastPage(item);
		}
		return (
			<View
				key={item.id}
				className="flex items-center justify-center flex-col gap-4 p-6 h-full"
			>
				<View className="z-0 w-full h-[40%] mb-10 flex justify-center items-center">
					<Image
						source={item.image}
						className="h-[100%]"
						resizeMode="contain"
						accessibilityLabel={item.title}
					/>
				</View>
				<Text className="text-heading-1 mb-3 mx-3">{item.title}</Text>
				<Text className="text-body leading-6 text-justify mx-3">
					{item.description}
				</Text>

				{/* Skip Button */}
				<TouchableOpacity
					className="justify-center items-center w-full absolute bottom-6"
					accessibilityLabel="Skip onboarding"
					accessibilityRole="button"
					onPress={async () => {
						await saveSecureItem('hasSeenWelcome', 'true');
						router.replace('/(auth)/signup');
					}}
				>
					<Text className="text-body-sm tracking-widest font-nexa-bold">
						Skip
					</Text>
				</TouchableOpacity>
			</View>
		);
	});

	return (
		<SafeAreaView className="bg-light-screen dark:bg-gray-950 h-full w-full flex justify-between items-center py-5">
			<StatusBar
				backgroundColor="transparent"
				barStyle={isDark ? 'light-content' : 'dark-content'}
			/>

			{/* Swiper */}
			<SwiperFlatList
				ref={swiperRef}
				data={content}
				renderItem={({ item }) => <View style={{ width }}>{item}</View>}
				onChangeIndex={({ index }) => setActiveIndex(index)}
				showPagination
				PaginationComponent={({ paginationIndex, size }) => (
					<View
						style={{
							flexDirection: 'row',
							backgroundColor: 'transparent',
							paddingHorizontal: 3,
							paddingVertical: 4,
							borderRadius: 999,
							alignSelf: 'center',
							position: 'absolute',
							bottom: '18.5%',
						}}
					>
						{Array.from({ length: size }).map((_, i) => (
							<View
								key={i}
								style={i === paginationIndex ? activeDotElem : dotElem}
							/>
						))}
					</View>
				)}
			/>

			{/* Next / Get Started Button */}
			<View className="w-full px-5 mb-2">
				<CustomButton
					label={isLastPage ? "Let's get started" : 'Next'}
					className="w-full"
					accessibilityLabel="Next Button"
					accessibilityRole="button"
					onPress={isLastPage ? handleContinue : handleNext}
				/>
			</View>
		</SafeAreaView>
	);
}
