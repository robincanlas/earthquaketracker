export namespace Models {
	export interface MapData {
		country: string;
		county: string | null;
		updatedAt: string;
		stats: {
			confirmed: number;
			deaths: number;
			recovered: number;
		};
		coordinates: {
			latitude: string;
			longitude: string;
		};
		province: string;
	}

	export interface EndPoint {
		url: string;
    significantByWeek: string;
    significantByMonth: string;
    byRangeWith: string;
	}
}