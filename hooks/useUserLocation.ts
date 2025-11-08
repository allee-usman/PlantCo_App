// hooks/useUserLocation.ts
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface LocationData {
	province: string;
	country: string;
	fullAddress: string;
	isLoading: boolean;
	error: string | null;
}

export const useUserLocation = () => {
	const [locationData, setLocationData] = useState<LocationData>({
		province: '',
		country: '',
		fullAddress: '',
		isLoading: true,
		error: null,
	});

	const requestLocationPermission = async () => {
		try {
			const { status } = await Location.requestForegroundPermissionsAsync();
			return status === 'granted';
		} catch (error) {
			console.error('Permission error:', error);
			return false;
		}
	};

	const fetchUserLocation = useCallback(async () => {
		try {
			setLocationData((prev) => ({ ...prev, isLoading: true, error: null }));

			// Check if location services are enabled
			const isEnabled = await Location.hasServicesEnabledAsync();
			if (!isEnabled) {
				Alert.alert(
					'Location Services Disabled',
					'Please enable location services to use this feature'
				);
				setLocationData((prev) => ({
					...prev,
					isLoading: false,
					error: 'Location services disabled',
				}));
				return;
			}

			// Request permission
			const hasPermission = await requestLocationPermission();
			if (!hasPermission) {
				setLocationData((prev) => ({
					...prev,
					isLoading: false,
					error: 'Permission denied',
				}));
				return;
			}

			// Get current position
			const location = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.Balanced,
			});

			// Reverse geocode to get address
			const [address] = await Location.reverseGeocodeAsync({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
			});

			if (address) {
				const province =
					address.region || address.subregion || address.city || '';
				const country = address.country || '';
				const fullAddress = [address.city, address.region]
					.filter(Boolean)
					.join(', ');

				setLocationData({
					province,
					country,
					fullAddress,
					isLoading: false,
					error: null,
				});
			} else {
				throw new Error('Unable to fetch address');
			}
		} catch (error) {
			console.error('Location fetch error:', error);
			setLocationData((prev) => ({
				...prev,
				isLoading: false,
				error: 'Failed to fetch location',
			}));
			Alert.alert('Error', 'Failed to get your location. Please try again.');
		}
	}, []);

	useEffect(() => {
		fetchUserLocation();
	}, [fetchUserLocation]);

	return {
		...locationData,
		refetch: fetchUserLocation,
	};
};
