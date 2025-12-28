import { ImageSourcePropType } from 'react-native';

interface AvatarWithBadgeProps {
	source: ImageSourcePropType;
	verified?: boolean;
	size?: number;
}
