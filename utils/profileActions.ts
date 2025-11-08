import { router } from 'expo-router';

export const handleProfileAction = (itemId: string): void => {
	switch (itemId) {
		case 'theme':
			router.push('/account/theme-settings');
			break;
		case 'Sign out':
			// Handle sign-out logic, e.g., clear tokens and navigate to login
			handleSignout();
			break;
		case 'Order History':
			router.push('/(root)/account/order-history');
			break;
		case 'My Bookings':
			router.push('/(root)/account/my-bookings');
			break;
		case 'My Wishlist':
			router.push('/(root)/account/wishlist');
			break;
		case 'My Address':
			router.push('/(root)/account/addresses');
			break;
		case 'Credit Cards':
			router.push('/(root)/account/payments');
			break;
		case 'Transactions':
			router.push('/(root)/account/transactions');
			break;
		case 'Notifications':
			router.push('/(root)/account/settings');
			break;
		case 'Help':
			router.push('/(root)/account/help');
			break;
		case 'FAQs':
			router.push('/(root)/account/faqs');
			break;
		case 'Change Email Address':
			router.push('/(root)/account/change-email');
			break;
		case 'Change Password':
			router.push('/account/change-password');
			break;
		case 'Legal Information':
			router.push({ pathname: '/(root)/account/legal-information' }); //TODO: Fix path issue
			break;
		default:
			console.log(`Default Pressed: ${item.title}`);
			break;
	}
};
