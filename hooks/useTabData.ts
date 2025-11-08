// src/screens/Home/hooks/useTabData.ts
import { useCallback, useState } from 'react';

export const useTabData = () => {
	const [activeTabId, setActiveTabId] = useState<string>('products');
	const handleTabPress = useCallback(
		(tabId: string) => setActiveTabId(tabId),
		[]
	);

	return { activeTabId, handleTabPress };
};
