// import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';

const Page = () => {
	// const { isSignedIn } = useAuth();

	// if (!isSignedIn) return <Redirect href="/(auth)/login" />;

	return <Redirect href="/(root)/(tabs)/home" />;
};

export default Page;

// import { UseDispatch } from 'react-redux';
// import React, { useEffect } from 'react';
// import { logout, loadUserFromStorage } from '../redux/slices';
// import { View, Text, Button } from 'react-native';

// function HomeScreen() {
// 	const { user, token, loading, error } = useSelector((state) => state.auth);
// 	const dispatch = useDispatch();

// 	useEffect(() => {
// 		dispatch(loadUserFromStorage());
// 	}, []);

// 	if (!token) {
// 		return <LoginScreen />;
// 	}

// 	return (
// 		<View style={{ padding: 20 }}>
// 			<Text>Welcome {user?.name}</Text>
// 			<Button title="Logout" onPress={() => dispatch(logout())} />
// 		</View>
// 	);
// }

// export default HomeScreen;
