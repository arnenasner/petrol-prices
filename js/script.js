import 'core-js/actual';
import 'regenerator-runtime/runtime.js';

// import { getData } from './modules/getData.js';
import { showLocation } from './modules/showMap.js';
import { getStations } from './modules/getStations.js';
import { getAvgPrices } from './modules/avgPrices.js';
// import { checkGeolocationPermission, postalCode } from './modules/lib.js';

showLocation();
getAvgPrices();
getStations();

// async function init() {
// 	// 1) Prüfen ob Geolocation erlaubt ist (macht KEINEN Fetch!)
// 	const permission = await checkGeolocationPermission(postalCode);

// 	// 2) Daten EINMAL laden
// 	const stations = await getData(postalCode);

// 	if (!stations) return;

// 	// 3) UI aktualisieren
// 	showLocation(stations);
// 	getStations(stations);
// 	getAvgPrices(stations);
// }

// init();
