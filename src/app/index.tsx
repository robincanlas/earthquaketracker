import * as React from 'react';
import * as style from './style.css';
import { Map } from 'app/components';
import { Image } from 'semantic-ui-react';

export const App: React.FC = () => {
	const [isLoading, setIsLoading] = React.useState(true);

	const mapIsLoaded = () => {
		setIsLoading(false);
	};

	return (
		<React.Fragment>
			{isLoading && <span className={style.loading}>
				<div className={style.title}>Monthly Earthquake tracker</div>	
				<div className={style['usgs-logo']}>
					<Image src='https://www.usgs.gov/sites/all/themes/usgs_palladium/logo.png' />
				</div>
				<div className={style.spinner} />
				<div className={style.footnote}>
					<p>© {new Date().getFullYear()}, Coded by Kristoffer Robin Canlas</p>
				</div>
			</span>}
			<Map mapIsLoaded={mapIsLoaded} />
		</React.Fragment>
	);
};