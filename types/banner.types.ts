export interface IBanner {
	_id: string;
	title: string;
	subtitle?: string;
	image: {
		url: string;
		public_id?: string;
	};
	link?: string;
	isActive: boolean;
	actionButtonLabel: string;
	type: 'product' | 'service';
	priority: number;
	startDate?: string; // serialized as string when coming from API
	endDate?: string;
	createdAt: string;
	updatedAt: string;
}
