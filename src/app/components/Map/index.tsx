import * as React from 'react';
import * as style from './style.css';
// import { Models } from 'app/models';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import axios from 'axios';
import { Icon } from 'semantic-ui-react';

// Mapbox css - needed to make tooltips work later in this article
// import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoicnVrYmluMDExIiwiYSI6ImNrYWdrbDI3bTA5NzgyeHBuaWkzbWIxeDQifQ.C7KY2elb_bs0qrST3HvSSQ';

export namespace Map {
	export interface Props {
		mapIsLoaded: () => void;
	}
}

export const Map: React.FC<Map.Props> = (props: Map.Props) => {
	// let map: mapboxgl.Map;
	const mapboxElRef = React.useRef(null); // DOM element to render map
	// const [mapState, setMap] = React.useState<mapboxgl.Map | null>(null);
	const [data, setData] = React.useState<any>([]);

	const fetchData = (url: string) => {
		axios.get(url)
		.then((res: any) => {
			setData(res.data.features);
		})
		.catch((error: any) => {
			throw new Error(error);
		});
	};

	React.useEffect(() => {
		fetchData('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson');
	}, []);
	
	const constructMap = () => {
		if (data.length > 0) {
			// You can store the map instance with useRef too
			const map = new mapboxgl.Map({
				container: mapboxElRef.current!,
				// style: 'mapbox://styles/rukbin011/ckagtrcc110de1ipt2pzqqn5v',
				style: 'mapbox://styles/rukbin011/ckc8or1203fi81irsp4poh1hv',
				center: [121.76572,  13.01153], // initial geo location for Philippines
				zoom: 4 // initial zoom
			});

			// Add navigation controls to the top right of the canvas
			map.addControl(new mapboxgl.NavigationControl());

			// Call this method when the map is loaded
			map.once('load', function() {
				// Add our SOURCE
				// with id 'points'
				map.addSource('points', {
					type: 'geojson',
					generateId: true,
					data: {
						type: 'FeatureCollection',
						// features: data as Feature<Geometry, GeoJsonProperties>[]
						features: data as any // change later
					}
				});
				
				// let radius = 1;

				map.addLayer({
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
				});

				map.addLayer({
					'id': 'outline',
					'type': 'circle',
					'source': 'points',
					'paint': {
						'circle-opacity': 0,
						'circle-color': 'transparent',
						'circle-stroke-width': 0.5,
						'circle-radius': 0,
						'circle-radius-transition': {
							'duration': 0
						}
					}
				});

				// // Animate the circle
				// setInterval(() => {
				// 	map.setPaintProperty('outline', 'circle-radius', radius);
				// 	radius = ++radius % 50;
				// 	if (radius === 50) {
				// 		map.setPaintProperty('outline', 'circle-opacity', 0);
				// 	}
				// }, 100);

				// Create a mapbox popup
				const popup = new mapboxgl.Popup({
					closeButton: false,
					closeOnClick: false
				});

				// setMap(map as any);
				props.mapIsLoaded();

				// Variable to hold the active country/province on hover
				let lastId: number | null = null;

				// Mouse move event
				map.on('mousemove', 'earthquake-layer', e => {
					if (e.features && e.features[0].properties && e.features[0].geometry.type === 'Point') {
						var features = map.queryRenderedFeatures(e.point);
						console.log(features);
						// Get the id from the properties
						const id = e.features[0].id as number;
						// Only if the id are different we process the tooltip
						if (id !== lastId) {
							lastId = id;

							// Change the pointer type on move move
							map.getCanvas().style.cursor = 'pointer';

							const { mag, place, time }: any = e.features[0].properties;
							const coordinates = e.features[0].geometry.coordinates!.slice();
							// Get all data for the tooltip

							const locationHtml = place !== 'null' ? `<p>Location: <b>${place}</b></p>` : '';

								const HTML = `${locationHtml}
												<p>Time: <b>${new Date(time).toDateString()} - ${new Date(time).toLocaleTimeString()}</b></p>
												<p>Magnitude: <b>${mag}</b></p>`;

							// Ensure that if the map is zoomed out such that multiple
							// copies of the feature are visible, the popup appears
							// over the copy being pointed to.
							while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
								coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
							}

							popup
								.setLngLat(coordinates as LngLatLike)
								.setHTML(HTML)
								.addTo(map);
						}
					}
				});

				// Mouse leave event
				map.on('mouseleave', 'earthquake-layer', () => {
					// Reset the last Id
					lastId = null;
					map.getCanvas().style.cursor = '';
					popup.remove();
				});
			});
		}
	};

	// // Initialize our map
	React.useEffect(() => {
		if (data.length > 0) {
			constructMap();
		}
	}, [data]);

	const resetFilter = () => {
		// 
	};

	return (
		<>
			{false && <div onClick={resetFilter} className={style.repeat}>
				<Icon size='big' name='repeat' />
			</div>}
			<div id={style.map}>
				<div className={style.mapContainer}>
					{/* Assigned Mapbox container */}
					<div className={style.mapBox} ref={mapboxElRef} />
				</div>
			</div>
		</>
	);
};