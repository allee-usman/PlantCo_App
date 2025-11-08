import { images } from '@/constants/images';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Image, Pressable, StatusBar, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotFoundScreen() {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	const { token } = useAppSelector((state: RootState) => state.auth);

	const redirectTo = token ? '/(root)/home' : '/(auth)/welcome';
	return (
		<SafeAreaView className=" bg-light-screen dark:bg-gray-950 h-full w-full px-8 py-5 flex justify-center items-center">
			<StatusBar
				translucent
				backgroundColor="black"
				// barStyle={isScrolling ? 'dark-content' : 'light-content'}
				// barStyle={isDark ? 'light-content' : 'dark-content'}
			/>
			<Image
				source={isDark ? images.error404Dark : images.error404}
				className="w-full h-[180px]"
				resizeMode="contain"
			/>
			<Text className="text-gray-500 dark:text-gray-400 font-nexa text-center text-4xl mb-12">
				Page{' '}
				<Text className="text-gray-700 dark:text-gray-300 text-center font-nexa-extrabold">
					Not Found
				</Text>
			</Text>
			<Pressable
				onPress={() => {
					router.replace(redirectTo);
				}}
				className="p-5 rounded-full bg-light-pallete-500 dark:bg-dark-pallete-500"
			>
				<Text className="text-body-lg text-center text-white font-nexa-bold">
					Bring me to Home
				</Text>
			</Pressable>
			href={redirectTo}
		</SafeAreaView>
	);
}
