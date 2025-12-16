import data from '../../data/plz_geocoord.json';
import {
	el,
	group,
	postalCode,
	checkGeolocationPermission,
	removeColorBorder,
	setColorBorder,
	removeHighlightPopup,
	highlightPopup,
} from './lib.js';
import { getStations } from './getStations.js';
import { getAvgPrices } from './avgPrices.js';
import L from 'leaflet';

let coordinates, stations, map;

const handleSearch = function () {
	el('.search__btn').addEventListener('click', e => {
		e.preventDefault();

		if (!data[postalCode]) {
			el('.info').innerText = 'Postleitzahl leider nicht gefunden.';
			return;
		}

		const { lat, lng } = data[postalCode];

		coordinates = [+lat, +lng];

		showLocation();
		getStations();
		getAvgPrices();
	});
};

handleSearch();

export const showLocation = function () {
	let curPos;

	navigator.geolocation.getCurrentPosition(
		pos => {
			curPos = [pos.coords.latitude, pos.coords.longitude];
			showMap(curPos);

			el('.location_denied_logo').style.visibility = 'hidden';

			el(
				'.info'
			).innerHTML = `Breitengrad:  <strong>${pos.coords.latitude}</strong> \u2014 Längengrad:  <strong>${pos.coords.longitude}</strong>`;

			// Display coordinates in info
			map.on('moveend', function () {
				const center = map.getCenter();

				if (postalCode) {
					el(
						'.info'
					).innerHTML = `Gesuchte Postleitzahl: <strong>${postalCode}</strong> <br /> Breitengrad: <strong>${center.lat}</strong> \u2014 Längengrad: <strong>${center.lng}</strong>`;
				}
			});
		},

		error => {
			el('.location_logo').style.visibility = 'hidden';

			if (postalCode) {
				// Get latitude and longitude from postal code
				const entry = data[postalCode];
				const lat = entry.lat;
				const lng = entry.lng;

				el(
					'.info'
				).innerHTML = `Gesuchte Postleitzahl: <strong>${postalCode}</strong> <br /> Breitengrad: <strong>${lat}</strong> \u2014 Längengrad: <strong>${lng}</strong>`;
			}

			showMap([53.0792962, 8.8016937], 13);
		}
	);
};

let mapInitialized = false;

const showMap = async function (curPos, zoom = 13) {
	if (mapInitialized) {
		map.flyTo(curPos, zoom);
	} else {
		map = L.map('map', {
			minZoom: 7,
			maxZoom: 17,
		});
		map.setView(curPos, zoom);
		mapInitialized = true;
	}

	stations = await checkGeolocationPermission(postalCode);

	L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
		maxZoom: 17,
		subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(map);

	stations.forEach(station => {
		const popup = L.popup({
			maxWidth: 200,
			minWidth: 50,
			autoClose: false,
			closeOnClick: false,
			closeButton: false,
		})
			.setLatLng([station.lat, station.lng])
			.setContent(`<div data-id="${station.id}"><h3>${station.brand}</h3></div>`)
			.addTo(map);

		popup.addEventListener('click', () => highlightStation(station.id));
	});

	// Click of popup highlights station in sidebar
	const highlightStation = function (e) {
		removeColorBorder();
		removeHighlightPopup();

		const id = e.target.closest('div[data-id]');

		if (!id) return;

		highlightPopup(id.parentElement.parentElement);

		if (!id) return;

		group('.station').forEach(station => {
			if (station.dataset.id === id.dataset.id) {
				// Highlight clicked station
				setColorBorder(station);

				// Scroll to clicked station
				station.scrollIntoView({ behavior: 'smooth', block: 'center' });

				// Center popup in map
				const stationLatLng = [station.dataset.lat, station.dataset.lng];

				map.flyTo(stationLatLng, 15, {
					animate: true,
					duration: 1, // in seconds
				});
			}
		});
	};

	group('.leaflet-popup-content-wrapper').forEach(popup => popup.addEventListener('click', highlightStation));
};

// Click on a station in sidebar moves map to popup an highlights it
const moveToPopup = function (e) {
	const stationEl = e.target.closest('.station');

	// find id of matching popup to station
	const popup = Array.from(group('.leaflet-popup-content div')).find(
		popup => popup.dataset.id === stationEl.dataset.id
	);

	if (!stationEl || !popup) return;

	removeColorBorder();
	removeHighlightPopup();

	const station = stations.find(station => station.id === stationEl.dataset.id);

	if (!station) return;

	setColorBorder(stationEl);
	highlightPopup(popup.parentElement.parentElement);

	map.flyTo([station.lat, station.lng], 15, {
		animate: true,
		duration: 1, // in seconds
	});
};

el('.cards').addEventListener('click', moveToPopup);
