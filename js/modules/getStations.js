import { getData } from './getData.js';
import { el, toStringWithComma, postalCode } from './lib.js';

export const getStations = async function () {
	try {
		const stations = await getData(postalCode);

		if (stations === null) {
			return;
		}

		stations.forEach(station => {
			// prettier-ignore
			const html = `
              <div class="station" data-id="${station.id}" data-lat="${station.lat}" data-lng="${station.lng}">
                  <div class="station__name">
                      <h2>
                        ${station.brand}   <span class="station__open-close"></span>
                      </h2>

                      ${station.street} ${station.houseNumber}, ${station.postCode} ${station.place}</li>
                  </div>
                  <div class="station__prices">
                      <ul>
                         <li>Diesel: <span class="price">${toStringWithComma(station.diesel)}</span></li>
                         <li>Super: <span class="price">${toStringWithComma(station.e5)}</span></li>
                         <li>Super E10: <span class="price">${toStringWithComma(station.e10)}</span></li>
                      </ul>
                  </div>
              </div>
            `

			el('.cards').insertAdjacentHTML('beforeend', html);

			const openCloseEl = el(`[data-id="${station.id}"] .station__name h2 .station__open-close `);
			openCloseEl.style.backgroundColor = station.isOpen ? 'var(--color-darkest)' : '#C84361';
			openCloseEl.innerHTML = station.isOpen ? 'Geöffnet' : 'Geschlossen';
		});
	} catch (error) {
		alert(error);
	}
};
