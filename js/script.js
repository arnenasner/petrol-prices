import 'core-js/actual';
import 'regenerator-runtime/runtime.js';

import { showLocation } from './modules/showMap.js';
import { getStations } from './modules/getStations.js';
import { getAvgPrices } from './modules/avgPrices.js';

showLocation();
getAvgPrices();
getStations();


