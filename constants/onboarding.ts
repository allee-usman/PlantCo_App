import { OnboardingItem } from '@/interfaces/interface';
import { images } from './images';

export const onboarding: OnboardingItem[] = [
	{
		id: 1,
		title: 'Discover your green Paradise!',
		description:
			'Find plants, gardening tools, and expert services - all in one place.',
		image: images.ilustration2,
	},
	{
		id: 2,
		title: 'See it, Know it, Grow it',
		description:
			"Spotted a gorgeous plant but don't know its name? Just snap a photo! Our AI instantly identifies plants and shows you to buy them.",
		image: images.ilustration3,
	},
	{
		id: 3,
		title: 'Everything under one roof!',
		description:
			'Need more than just plants? Find expert gardeners, landscapers, and garden maintenance services. Your dream garden is just a tap away.',
		image: images.ilustration4,
	},
	{
		id: 4,
		title: 'Welcome',
		description: 'Really happy to onboard you!',
		image: images.ilustration5,
	},
];
