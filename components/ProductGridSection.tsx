import React from 'react';
import ProductCard from './ProductCard';
import Section from './Section';

type Product = {
	id: string;
	title: string;
	price: number;
	image: string;
	badge?: string;
};

type ProductGridSectionProps = {
	title: string;
	products: Product[];
	onPressProduct?: (id: string) => void;
};

const ProductGridSection: React.FC<ProductGridSectionProps> = ({
	title,
	products,
	onPressProduct,
}) => {
	return (
		<Section
			title={title}
			containerStyle={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				flexWrap: 'wrap',
				gap: 8,
			}}
		>
			{products.map((p) => (
				<ProductCard key={p.id} product={p} onPress={onPressProduct} />
			))}
		</Section>
	);
};

export default ProductGridSection;
