import React from 'react';
import { Text, View } from 'react-native';

import ListingCard from '@/components/ServiceListingCard';
import { Service } from '@/types/service.types';

interface ListingsSectionProps {
	listings: Service[];
	onItemPress?: (listing: Service) => void;
	titlePrefix?: string;
}

const ListingsSection: React.FC<ListingsSectionProps> = ({
	listings,
	onItemPress,
	titlePrefix = 'All',
}) => {
	return (
		<View>
			<Text className="text-base font-nexa-extrabold text-gray-900 dark:text-gray-100 mb-3">
				{titlePrefix} {listings.length}+
			</Text>

			{listings.map((listing) => (
				<ListingCard
					key={listing._id}
					listing={listing}
					onPress={() => onItemPress?.(listing)}
				/>
			))}
		</View>
	);
};

export default ListingsSection;
