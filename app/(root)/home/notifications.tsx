import React, { useState } from 'react';
import {
	ScrollView,
	Text,
	useColorScheme,
	useWindowDimensions,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ProductCard from '@/components/TestingCard';

// A simple screen to visually test ProductCard component with several mock items.
// Place this file under your screens/test/ or screens/ folder and register in router if needed.

const MOCK_PRODUCTS = [
	{
		id: 'p1',
		image:
			'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200&auto=format&fit=crop&q=80',
		title: 'Monstera Deliciosa',
		description: 'Large split-leaf houseplant. Low maintenance.',
		price: 2499,
		rating: 4.6,
		reviewCount: 134,
		compareAtPrice: 2999,
		discount: 17,
		isWishlisted: false,
		inStock: true,
	},
	{
		id: 'p2',
		image:
			'https://images.unsplash.com/photo-1524594154906-3f9a5b2d9b3b?w=1200&auto=format&fit=crop&q=80',
		title: 'Snake Plant',
		description: 'Tolerant to low light and irregular watering.',
		price: 1499,
		rating: 4.2,
		reviewCount: 59,
		compareAtPrice: 0,
		discount: 0,
		isWishlisted: true,
		inStock: true,
	},
	{
		id: 'p3',
		image:
			'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200&auto=format&fit=crop&q=80',
		title: 'Air Plant Bundle',
		description: 'Decorative tillandsia bundle — no soil required.',
		price: 799,
		rating: 3.9,
		reviewCount: 21,
		compareAtPrice: 999,
		discount: 20,
		isWishlisted: false,
		inStock: false,
	},
];

const ProductCardTestScreen: React.FC = () => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';

	// local UI state to simulate adding to cart and wishlist toggles
	const [addingMap, setAddingMap] = useState<Record<string, boolean>>({});
	const [wishlistMap, setWishlistMap] = useState<Record<string, boolean>>(
		MOCK_PRODUCTS.reduce(
			(acc, p) => ({ ...acc, [p.id]: p.isWishlisted }),
			{} as any
		)
	);

	const handleAddToCart = async (id: string) => {
		setAddingMap((s) => ({ ...s, [id]: true }));
		// simulate network delay
		setTimeout(() => setAddingMap((s) => ({ ...s, [id]: false })), 900);
	};

	const handleWishlistToggle = (id: string) => {
		setWishlistMap((s) => ({ ...s, [id]: !s[id] }));
	};
	const { width: screenWidth } = useWindowDimensions();
	const cardWidth = (screenWidth - 44) / 2;

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: isDark ? '#0f1720' : '#ffffff' }}
		>
			<ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
				<View style={{ marginBottom: 6 }}>
					<Text
						style={{
							fontSize: 18,
							fontWeight: '700',
							color: isDark ? '#fff' : '#111',
						}}
					>
						ProductCard — Test Screen
					</Text>
					<Text style={{ fontSize: 12, color: isDark ? '#cbd5e1' : '#6b7280' }}>
						This screen renders multiple ProductCard variations using mock data.
					</Text>
				</View>

				{MOCK_PRODUCTS.map((p) => (
					<View key={p.id}>
						<ProductCard
							image={p.image}
							title={p.title}
							// description={p.description}
							price={p.price}
							rating={p.rating}
							reviewCount={p.reviewCount}
							compareAtPrice={p.compareAtPrice}
							discount={p.discount}
							isWishlisted={!!wishlistMap[p.id]}
							width={cardWidth}
							height={cardWidth * 1.2}
							inStock={p.inStock}
							onAddToCart={() => handleAddToCart(p.id)}
							onWishlistToggle={() => handleWishlistToggle(p.id)}
							addingToCart={!!addingMap[p.id]}
						/>
					</View>
				))}

				<View style={{ height: 40 }} />
			</ScrollView>
		</SafeAreaView>
	);
};

export default ProductCardTestScreen;
