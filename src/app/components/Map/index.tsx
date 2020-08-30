import * as React from 'react';
import * as style from './style.css';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import axios from 'axios';
import { endPoint, mapboxToken, mapboxStyle, mapboxLayer, getMagnitudes } from 'app/constants';
import { Dropdown, DropdownProps, Icon } from 'semantic-ui-react';

// Mapbox css - needed to make tooltips work later in this article
// import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = mapboxToken;

export namespace Map {
	export interface Props {
		mapIsLoaded: () => void;
	}
}

export const Map: React.FC<Map.Props> = (props: Map.Props) => {
	const mapboxElRef = React.useRef(null); // DOM element to render map
	const [mapState, setMap] = React.useState<mapboxgl.Map | null>(null);
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
		fetchData(endPoint.url);
	}, []);
	
	const constructMap = () => {
		if (data.length > 0) {
			// You can store the map instance with useRef too
			const map = new mapboxgl.Map({
				container: mapboxElRef.current!,
				// style: 'mapbox://styles/rukbin011/ckagtrcc110de1ipt2pzqqn5v',
				style: mapboxStyle,
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

				// Add the circle layers
				map.addLayer(mapboxLayer);

				// Create a mapbox popup
				const popup = new mapboxgl.Popup({
					closeButton: false,
					closeOnClick: false
				});

				setMap(map as any);
				props.mapIsLoaded();

				// Variable to hold the active country/province on hover
				let lastId: number | null = null;

				// Mouse move event
				map.on('mousemove', 'earthquake-layer', e => {
					if (e.features && e.features[0].properties && e.features[0].geometry.type === 'Point') {
						// Get the id from the properties
						const id = e.features[0].id as number;
						// Only if the id are different we process the tooltip
						if (id !== lastId) {
							lastId = id;
							// map.setPaintProperty(
							// 	'Outline', 
							// 	'circle-radius', 
							// 	['match', ['get', id.toString()], id.toString(), 100, 0]
							// );
							// map.setPaintProperty(
							// 	'Outline', 
							// 	'circle-opacity', 
							// 	['match', ['get', id.toString()], id.toString(), 1, 0]
							// );
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

	const [dropdownValue, setDropdownValue] = React.useState<string>('');

	// Initialize our map
	React.useEffect(() => {
		if (data.length > 0) {
			constructMap();
		}
	}, [data]);

	const buildRange = (start: number): (number | string)[] => {
		const range: (number | string)[] = ['in', 'mag'];
		for (let i = 0; i < 10; i++) {
			const value: string = `${start}.${i}`;
			range.push(+value);
		}
		return range;
	};

	const handleDropdownChange = (event: React.SyntheticEvent<HTMLElement, Event>, dropdownData: DropdownProps) => {
		const magnitude: number | null = dropdownData.value ? +dropdownData.value : null;
		setDropdownValue(dropdownData.value as string);
		if (mapState && magnitude) {
			// mapState.setFilter('earthquake-layer', ['>=', ['get', 'mag'], magnitude]);
			// filter in magnitude with range from .0 to .9;
			mapState.setFilter('earthquake-layer', buildRange(magnitude));
		}
	};

	const resetFilter = () => {
		// reset filter
		if (mapState) {
			setDropdownValue('');
			mapState.setFilter('earthquake-layer', null);
		}
	};

	return (
		<>
			<div className={style.dropdown}>
				<Dropdown
					onChange={handleDropdownChange}
					placeholder='Select Magnitude'
					fluid
					search
					selection
					options={getMagnitudes()}
					value={dropdownValue}
				/>
			</div>
			{dropdownValue !== '' && <div onClick={resetFilter} className={style.repeat}>
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