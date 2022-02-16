import * as React from 'react';
import * as style from './style.css';
import { Map } from 'app/components';
import { Image } from 'semantic-ui-react';
import logo from 'app/usgs_logo.png';

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
					<Image src={logo} />
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