import { Models } from 'app/models';
import { DropdownItemProps } from 'semantic-ui-react';

export const assetsPath: string =  '../../assets';
export interface Icon { [key: string]: JSX.Element; }

export const endPoint: Models.EndPoint = {
	url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson',
};
export const mapboxToken: string = 'pk.eyJ1IjoicnVrYmluMDExIiwiYSI6ImNrYWdrbDI3bTA5NzgyeHBuaWkzbWIxeDQifQ.C7KY2elb_bs0qrST3HvSSQ';
export const mapboxStyle: string = 'mapbox://styles/rukbin011/ckc8or1203fi81irsp4poh1hv';
export const mapboxLayer: mapboxgl.Layer = {
	'id': 'earthquake-layer',
	'type': 'circle',
	'source': 'points',
	'paint': {
		'circle-opacity': 0.5,
		'circle-stroke-width': 0.5,
		'circle-color': [
			'interpolate',
			['linear'],
			['get', 'mag'],
			// https://colorbrewer2.org/#type=sequential&scheme=YlOrRd&n=9 color palette
			1, '#ffffcc',
			2, '#ffeda0',
			3, '#fed976',
			4, '#feb24c',
			5, '#fd8d3c',
			6, '#fc4e2a',
			7, '#e31a1c',
			8, '#bd0026',
			9, '#b10026',
			10, '#b10026',
		],
		'circle-radius': [
			'interpolate',
			['linear'],
			['get', 'mag'],
			0, 2,
			1, 4,
			2, 8,
			3, 12,
			4, 16,
			5, 20,
			6, 30,
			7, 45,
			8, 65,
			9, 75,
			10, 100
		]
	}
};

export const getMagnitudes = (): DropdownItemProps[] => {
	const magnitudes: DropdownItemProps[] = [];
	for (let index = 1; index <= 10; index++) {
		const magnitude = { key: index.toString(), value: index.toString(), text: `Magnitude ${index.toString()}+` };
		magnitudes.push(magnitude);
	}
	return magnitudes;
};

export enum Statistics {
	CONFIRMED = 'confirmed',
	RECOVERED = 'recovered',
	DEATHS = 'deaths'
}

export enum ActionTypes {
	GET_STATISTICS_REQUEST = 'GET_STATISTICS_REQUEST',
	GET_STATISTICS_SUCCESS = 'GET_STATISTICS_SUCCESS',
	GET_STATISTICS_FAILED = 'GET_STATISTICS_FAILED',

	SET_GLOBAL_STATISTICS = 'SET_GLOBAL_STATISTICS',
	SET_COUNTRY_STATISTICS = 'SET_COUNTRY_STATISTICS',

	GET_COUNTRIES_REQUEST = 'GET_COUNTRIES_REQUEST',
	GET_COUNTRIES_SUCCESS = 'GET_COUNTRIES_SUCCESS',
	GET_COUNTRIES_FAILED = 'GET_COUNTRIES_FAILED',

	GET_DAILY_REQUEST = 'GET_DAILY_REQUEST',
	GET_DAILY_SUCCESS = 'GET_DAILY_SUCCESS',
	GET_DAILY_FAILED = 'GET_DAILY_FAILED'
}