import { getData } from './getData.js';

export const el = css => document.querySelector(css);
export const group = css => document.querySelectorAll(css);
export const create = el => document.createElement(el);

export const toStringWithComma = num => {
	const numStr = num.toString().replace('.', ',');
	return `${numStr.slice(0, -1)}<sup>${numStr.slice(-1)}</sup>`;
};

const infoStyle = function (txt) {
	el('.info').style.fontSize = '2.5rem';
	el('.info').innerText = txt;
};

export const checkValue = function (val) {
	if (typeof val !== 'string' || !val.trim()) {
		infoStyle('Bitte eine Postleitzahl eingeben.');
		return;
	}

	const cleanedValue = val.replace(/\s+/g, '');

	if (!cleanedValue) {
		infoStyle('Bitte eine Postleitzahl eingeben.');
		return;
	}

	const postalCodeRegex = /^(?!01000)(?!99999)(?:0[1-46-9]\d{3}|[1-357-9]\d{4})$/;
	if (!postalCodeRegex.test(cleanedValue)) {
		infoStyle('Die Postleitzahl ist ungültig.');
		return;
	}
	return cleanedValue;
};

export let postalCode = null;

el('.search__btn').addEventListener('click', e => {
	e.preventDefault();
	const input = el('.search__input');

	if (input) {
		postalCode = checkValue(input.value);
		input.value = '';
	}
});

export const calcAvg = function (prices, key) {
	return prices.reduce((sum, { [key]: value }) => sum + value, 0) / prices.length;
};

export const checkGeolocationPermission = async postalCode => {
	const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });

	let stations = [];

	if (permissionStatus.state === 'granted') {
		document.querySelector('#map').style.gridColumn = '2 / -1';
		document.querySelector('#map').style.gridRow = '3 / -1';

		if (postalCode) {
			document.querySelector('.header_info').style.visibility = 'hidden';
		}

		stations = await getData(postalCode);
	}

	if (permissionStatus.state === 'denied') {
		stations = postalCode ? await getData(postalCode) : [];
	}

	return stations;
};

// Remove changed colors of clicked station
export const removeColorBorder = function () {
	group('.station').forEach(station => {
		station.style.border = '3px solid var(--color-light)';
		station.style.backgroundColor = 'var(--color-lightest)';
	});
};

// Change colors of clicked station
export const setColorBorder = function (el) {
	el.style.border = '3px solid green';
	el.style.backgroundColor = 'var(--color-grey-light)';
	el.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

export const removeHighlightPopup = function () {
	group('.leaflet-popup-content-wrapper').forEach(popup => {
		popup.style.backgroundColor = 'var(--color-darkest)';
		popup.style.color = 'var(--color-lightest)';
		popup.style.border = 'none';
	});
};

export const highlightPopup = function (el) {
	if (!el) return;
	el.style.backgroundColor = 'var(--color-light)';
	el.style.color = 'var(--color-darkest)';
	el.style.border = '2px solid var(--color-darkest)';
};
