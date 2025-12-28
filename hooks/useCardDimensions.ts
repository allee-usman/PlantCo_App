import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

type CardType =
	| 'service'
	| 'product'
	| 'sponsoredProduct'
	| 'accessory'
	| 'plant'
	| 'default';

interface UseCardDimensionsProps {
	cardType: CardType;
	width?: number;
	height?: number;
	fullWidth?: boolean;
}

export function useCardDimensions({
	cardType,
	width,
	height,
	fullWidth,
}: UseCardDimensionsProps) {
	const { width: screenWidth } = useWindowDimensions();

	// Default ratios per card type
	const typeRatios = {
		service: 0.5, // wide card
		product: 1.2, // tall card
		sponsoredProduct: 1.1,
		plant: 1.3,
		accessory: 1.1,
		default: 1,
	};

	const ratio = typeRatios[cardType] ?? typeRatios.default;

	/** ---------------------------
	 * 📌 WIDTH Calculation
	 * ---------------------------- */
	const cardWidth = useMemo(() => {
		if (fullWidth) return screenWidth - 32;

		// allow user override
		if (width) return width;

		// Default width pattern
		return (screenWidth - 44) / 1.6;
	}, [width, fullWidth, screenWidth]);

	/** ---------------------------
	 * 📌 HEIGHT Calculation
	 * ---------------------------- */
	const cardHeight = useMemo(() => {
		if (height) return height;

		// height based on type ratio
		return cardWidth * ratio;
	}, [height, cardWidth, ratio]);

	return { cardWidth, cardHeight };
}
