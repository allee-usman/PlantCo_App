import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
	Animated,
	Image,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

type SearchBarVariant = 'default' | 'greeting' | 'service';

interface SearchBarProps {
	variant?: SearchBarVariant;
	onSearch?: (query: string) => void;
	showScanIcon?: boolean;
	showFilterIcon?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
	variant = 'product',
	onSearch,
	showScanIcon = true,
	showFilterIcon = false,
}) => {
	// Different placeholders for different variants
	const productPlaceholders = React.useMemo(
		() => [
			'Find your plants',
			'Search for accessories',
			'Explore greenery',
			'Discover new plants',
		],
		[]
	);

	const servicePlaceholders = React.useMemo(
		() => [
			'Book gardening services',
			'Find plant care experts',
			'Schedule maintenance',
			'Search professionals',
		],
		[]
	);

	const placeholders =
		variant === 'service' ? servicePlaceholders : productPlaceholders;
	// console.log(variant);

	const handleSearchPress = () => {
		const route =
			variant === 'service'
				? '/(root)/home/service-search'
				: '/(root)/home/search';
		router.push(route);
	};

	const handleScanPress = () => {
		router.push('/(root)/scan');
	};

	const handleFilterPress = () => {
		const route =
			variant === 'service'
				? '/(root)/home/service-filters'
				: '/(root)/home/filters';
		router.push(route);
	};

	// State to track the current placeholder index
	const [currentIndex, setCurrentIndex] = useState(0);

	// Animation value for sliding effect
	const slideAnim = useRef(new Animated.Value(-20)).current;

	// Effect to cycle through placeholders with animation
	useEffect(() => {
		// Function to animate placeholder
		const animatePlaceholder = () => {
			// Reset to top
			slideAnim.setValue(20);
			// Slide in from top to center
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 500,
				useNativeDriver: true,
			}).start(() => {
				// After slide-in, wait for 3 seconds, then slide out
				setTimeout(() => {
					Animated.timing(slideAnim, {
						toValue: -20, // Slide out downward
						duration: 500,
						useNativeDriver: true,
					}).start(() => {
						// Update to next placeholder and reset animation
						setCurrentIndex((prev) => (prev + 1) % placeholders.length);
					});
				}, 3000);
			});
		};

		// Initial animation
		animatePlaceholder();

		// Set up interval for cycling
		const interval = setInterval(animatePlaceholder, 4000);

		// Clean up interval on unmount
		return () => clearInterval(interval);
	}, [placeholders, slideAnim]);

	// Different icons for different variants

	return (
		<View className="flex-row items-center">
			<View className="flex-row items-center bg-light-surface dark:bg-gray-900 rounded-xl py-1 h-[46px] flex-1 border-gray-200 dark:border-light-pallete-300">
				{/* Start Icon */}
				<Image
					source={icons.search}
					resizeMode="contain"
					tintColor={COLORS.gray[400]}
					style={{ width: 22, height: 22, marginLeft: 8 }}
				/>
				{/* TextInput with Animated Placeholder */}
				<TouchableOpacity
					style={styles.inputContainer}
					onPress={handleSearchPress}
					activeOpacity={0.7}
				>
					<TextInput
						className="ml-2 flex-1 text-sm font-nexa"
						placeholderTextColor={COLORS.gray[400]}
						accessibilityLabel={
							variant === 'service'
								? 'Search for services'
								: 'Search for products'
						}
						editable={false}
						pointerEvents="none"
					/>
					{/* Custom Animated Placeholder */}
					<Animated.Text
						style={[
							styles.placeholder,
							{
								transform: [{ translateY: slideAnim }],
								opacity: slideAnim.interpolate({
									inputRange: [-20, 0, 20],
									outputRange: [0, 1, 0],
								}),
							},
						]}
					>
						{placeholders[currentIndex]}
					</Animated.Text>
				</TouchableOpacity>
				{/* End Icon - Scan for products, Filter for services */}
				{variant === 'service' ? (
					<TouchableOpacity
						onPress={handleFilterPress}
						activeOpacity={0.7}
						className="w-[36px] h-[36px] rounded-lg items-center justify-center bg-light-pallete-50 dark:bg-gray-800 mr-2"
					>
						<Image
							source={icons.settingSlider}
							resizeMode="contain"
							tintColor={COLORS.light.pallete[600]}
							style={{ width: 20, height: 20 }}
						/>
					</TouchableOpacity>
				) : (
					<TouchableOpacity onPress={handleScanPress} activeOpacity={0.7}>
						<Image
							source={icons.scan}
							resizeMode="contain"
							tintColor={COLORS.gray[500]}
							style={{ width: 26, height: 26, marginRight: 8 }}
						/>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

// Styles
const styles = StyleSheet.create({
	inputContainer: {
		flex: 1,
		position: 'relative',
	},
	placeholder: {
		position: 'absolute',
		fontFamily: 'Nexa-400',
		left: 8,
		top: '50%',
		marginTop: -9,
		color: COLORS.gray[400],
		fontSize: 14,
	},
});

export default SearchBar;
