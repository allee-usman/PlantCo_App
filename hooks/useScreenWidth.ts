// useScreenWidth.ts
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

export const useScreenWidth = () => {
	const [screenWidth, setScreenWidth] = useState(
		Dimensions.get('window').width
	);

	useEffect(() => {
		const onChange = ({ window }: { window: any }) => {
			setScreenWidth(window.width);
		};

		const subscription = Dimensions.addEventListener('change', onChange);

		return () => {
			subscription?.remove?.(); // cleanup for newer RN versions
		};
	}, []);

	return screenWidth;
};
