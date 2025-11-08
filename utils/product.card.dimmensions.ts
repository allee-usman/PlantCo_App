// Responsive sizing based on screen width and variant
export const getResponsiveDimensions = (
	variant: 'compact' | 'standard' | 'expanded',
	screenWidth: number,
	width?: number
) => {
	const finalWidth = width || (screenWidth > 800 ? 220 : 160);

	const sizeConfig = {
		compact: {
			width: finalWidth,
			height: finalWidth * 1.3,
			imageRatio: 0.55,
			titleSize: 13,
			ratingSize: 11,
			priceSize: 13,
			iconSize: 14,
			padding: 10,
			imageSpacing: 8,
		},
		standard: {
			width: finalWidth,
			height: finalWidth * 1.2,
			imageRatio: 0.7,
			titleSize: 14,
			ratingSize: 12,
			priceSize: 14,
			iconSize: 16,
			padding: 12,
			imageSpacing: 8,
		},
		expanded: {
			width: finalWidth,
			height: finalWidth * 1.8,
			imageRatio: 0.65,
			titleSize: 15,
			ratingSize: 13,
			priceSize: 15,
			iconSize: 18,
			padding: 14,
			imageSpacing: 10,
		},
	};

	return sizeConfig[variant];
};
