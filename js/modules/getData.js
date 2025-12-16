import { el, group } from './lib.js';
import plzGeoCoord from '../../data/plz_geocoord.json';

// Cache of in-flight and completed requests keyed by postalCode or lat/lng
const requestCache = new Map();

export const getData = async function (postalCode) {
	let lat, lng;
	const spinnerOverlay = el('.spinner-overlay');

	try {
		if (spinnerOverlay) spinnerOverlay.style.display = 'flex';

		if (!postalCode) {
			// Geolocation
			const position = await new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(resolve, reject);
			});
			lat = position.coords.latitude;
			lng = position.coords.longitude;
		} else {
			// PLZ
			const entry = plzGeoCoord[postalCode];
			if (!entry) throw new Error('PLZ nicht gefunden');
			lat = entry.lat;
			lng = entry.lng;

			// UI
			el('#map').style.gridColumn = '2 / 4';
			el('#map').style.gridRow = '3 / -1';

			['.cards', '.avgPrices'].forEach(selector => {
				const elNode = el(selector);
				elNode.dataset.oldSearch = elNode.innerHTML;
				elNode.innerHTML = '';
			});

			['.leaflet-popup-content-wrapper', '.leaflet-popup-tip-container'].forEach(className =>
				group(className).forEach(popup => popup.remove())
			);
		}

		// Build a stable cache key: prefer postalCode when available
		const key = postalCode ? `plz:${postalCode}` : `geo:${lat.toFixed(5)}:${lng.toFixed(5)}`;

		// If there's already an in-flight (or completed) request for this key, reuse it
		if (requestCache.has(key)) {
			return await requestCache.get(key);
		}

		// Create the fetch promise and store it in the cache immediately so concurrent callers reuse it
		const fetchPromise = (async () => {
			const res = await fetch(`/.netlify/functions/getData?lat=${lat}&lng=${lng}`);
			const data = await res.json();

			if (!res.ok) throw new Error(`${data.message || 'Fehler bei API'} (${res.status})`);

			return data.stations;
		})();

		requestCache.set(key, fetchPromise);

		try {
			const stations = await fetchPromise;
			return stations;
		} catch (error) {
			// Remove failed request from cache so future calls can retry
			requestCache.delete(key);
			throw error;
		} finally {
			if (spinnerOverlay) spinnerOverlay.style.display = 'none';
		}
	} catch (error) {
		console.error(error);
		return null;
	}
};
