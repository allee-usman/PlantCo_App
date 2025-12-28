import ServiceCard from '@/components/ServiceCard';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';

const services = [
	{
		id: '1',
		name: 'Electrician',
		image: 'https://images.pexels.com/photos/5854182/pexels-photo-5854182.jpeg',
		price: 1200,
		rating: 4.7,
		reviewCount: 89,
		specialities: ['Wiring', 'House Repair', 'Installations', 'Lighting'],
		status: 'available',
		experience: '5 yrs',
		location: 'Johar Town, Lahore',
		completedJobs: 210,
		verified: true,
	},
	{
		id: '2',
		name: 'Plumber',
		image: 'https://images.pexels.com/photos/5854202/pexels-photo-5854202.jpeg',
		price: 900,
		rating: 4.5,
		reviewCount: 56,
		specialities: ['Leak Fix', 'Pipes', 'Water Motor'],
		status: 'busy',
		experience: '3 yrs',
		location: 'Wapda Town, Lahore',
		completedJobs: 140,
		verified: true,
	},
];

export default function ServiceListExample() {
	const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
	const [booking, setBooking] = useState<{ [key: string]: boolean }>({});

	const toggleFavorite = (id: string) => {
		setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	const onBookNow = (id: string) => {
		setBooking((prev) => ({ ...prev, [id]: true }));

		setTimeout(() => {
			setBooking((prev) => ({ ...prev, [id]: false }));
			alert('Booking confirmed!');
		}, 1500);
	};

	return (
		<ScrollView className="mt-4 px-3" contentContainerStyle={{ gap: 16 }}>
			{services.map((item) => (
				<ServiceCard
					key={item.id}
					image={item.image}
					name={item.name}
					price={item.price}
					rating={item.rating}
					reviewCount={item.reviewCount}
					specialities={item.specialities}
					status={item.status as 'available' | 'busy' | 'on_leave'}
					experience={item.experience}
					location={item.location}
					completedJobs={item.completedJobs}
					verified={item.verified}
					isFavorite={favorites[item.id]}
					booking={booking[item.id]}
					onPress={() => console.log('Open profile:', item.name)}
					onFavoriteToggle={() => toggleFavorite(item.id)}
					onBookPress={() => onBookNow(item.id)}
					width={340}
					height={170}
				/>
			))}
		</ScrollView>
	);
}
