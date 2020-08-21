import * as React from 'react';
import * as style from './style.css';
import { Map } from 'app/components';

export const App: React.FC = () => {
	const [isLoading, setIsLoading] = React.useState(true);

	const mapIsLoaded = () => {
		setIsLoading(false);
	};

	return (
		<React.Fragment>
			{isLoading && <span className={style.loading}>
				<div className={style.title}>Monthly Earthquake tracker</div>	
				<div className={style['sk-cube-grid']}>
					<div className={`${style['sk-cube']} ${style['sk-cube1']}`}></div>
					<div className={`${style['sk-cube']} ${style['sk-cube2']}`}></div>
					<div className={`${style['sk-cube']} ${style['sk-cube3']}`}></div>
					<div className={`${style['sk-cube']} ${style['sk-cube4']}`}></div>
					<div className={`${style['sk-cube']} ${style['sk-cube5']}`}></div>
					<div className={`${style['sk-cube']} ${style['sk-cube6']}`}></div>
					<div className={`${style['sk-cube']} ${style['sk-cube7']}`}></div>
					<div className={`${style['sk-cube']} ${style['sk-cube8']}`}></div>
					<div className={`${style['sk-cube']} ${style['sk-cube9']}`}></div>
				</div>
				<div className={style.footnote}>
					<p>© {new Date().getFullYear()}, Coded by Kristoffer Robin Canlas</p>
				</div>
			</span>}
			<Map mapIsLoaded={mapIsLoaded} />
		</React.Fragment>
	);
};