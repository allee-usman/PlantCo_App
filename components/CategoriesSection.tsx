import CategoryCard from '@/components/CategoryCard';
import { Category } from '@/interfaces/category.interface';
import React from 'react';
import { FlatList, View } from 'react-native';
import SectionHeader from './SectionHeader';

interface ServiceCategoriesProps {
	categories: Category[];
	onViewAll?: () => void;
	onCategoryPress?: (category: Category) => void;
}

const CategoriesSection: React.FC<ServiceCategoriesProps> = ({
	categories,
	onViewAll,
	onCategoryPress,
}) => {
	// const router = useRouter();

	const handleViewAll = () => {
		if (onViewAll) {
			onViewAll();
		} else {
			// router.push('/services/categories');
		}
	};

	const handleCategoryPress = (category: Category) => {
		if (onCategoryPress) {
			onCategoryPress(category);
		} else {
			// router.push(`/services/${category.id}`);
			//TODO: change the content of home screen with respect to category selected
		}
	};

	return (
		<View>
			{/* Header */}

			<View className="px-4 mb-2">
				<SectionHeader
					label="Quick Categories"
					rightButton
					rightBtnLabel="View All"
				/>
			</View>

			{/* Categories List */}
			<FlatList
				data={categories}
				horizontal
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item._id}
				contentContainerStyle={{
					paddingHorizontal: 16,
					gap: 12,
				}}
				renderItem={({ item }) => (
					<CategoryCard
						name={item.name}
						icon={item.image?.url || ''}
						iconType="image"
						onPress={() => handleCategoryPress(item)}
						variant="pill"
						bgColor="#fff"
					/>
				)}
			/>
		</View>
	);
};

export default CategoriesSection;
