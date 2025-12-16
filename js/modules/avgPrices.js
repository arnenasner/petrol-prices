import { el, toStringWithComma, calcAvg, postalCode } from './lib.js';
import { getData } from './getData.js';

export const getAvgPrices = async function () {
	try {
		const prices = await getData(postalCode);

		if (prices === null) return;

		const avgDiesel = calcAvg(prices, 'diesel').toFixed(3);
		const avgE5 = calcAvg(prices, 'e5').toFixed(3);
		const avgE10 = calcAvg(prices, 'e10').toFixed(3);

		// prettier-ignore
		const html =
            `
            <li>Diesel: <span class="avgPrice">${toStringWithComma(avgDiesel)}</span></li>
			<li>Super: <span class="avgPrice">${toStringWithComma(avgE5)}</span></li>
			<li>Super E10: <span class="avgPrice">${toStringWithComma(avgE10)}</span></li>
            `

		el('.avgPrices').insertAdjacentHTML('beforeend', html);
	} catch (error) {
		console.error(error);
	}
};
