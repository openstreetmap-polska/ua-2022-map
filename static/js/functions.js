import { localStorageLayersItemId } from './constants.js';
import { layersDefinitions, layersVisibilityState } from './layers.js';

export function renderPopupRouteLink(text, href, hideOnDesktop) {
  return `<div class="p-1">
        <a target="_blank" rel="noopener" class="button p-1 is-fullwidth is-link ${hideOnDesktop ? 'is-hidden-desktop' : ''}"
        href="${href}">
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M18.27 6C19.28 8.17 19.05 10.73 17.94 12.81C17 14.5 15.65 15.93 14.5 17.5C14 18.2 13.5 18.95 13.13 19.76C13 20.03 12.91 20.31 12.81 20.59C12.71 20.87 12.62 21.15 12.53 21.43C12.44 21.69 12.33 22 12 22H12C11.61 22 11.5 21.56 11.42 21.26C11.18 20.53 10.94 19.83 10.57 19.16C10.15 18.37 9.62 17.64 9.08 16.93L18.27 6M9.12 8.42L5.82 12.34C6.43 13.63 7.34 14.73 8.21 15.83C8.42 16.08 8.63 16.34 8.83 16.61L13 11.67L12.96 11.68C11.5 12.18 9.88 11.44 9.3 10C9.22 9.83 9.16 9.63 9.12 9.43C9.07 9.06 9.06 8.79 9.12 8.43L9.12 8.42M6.58 4.62L6.57 4.63C4.95 6.68 4.67 9.53 5.64 11.94L9.63 7.2L9.58 7.15L6.58 4.62M14.22 2.36L11 6.17L11.04 6.16C12.38 5.7 13.88 6.28 14.56 7.5C14.71 7.78 14.83 8.08 14.87 8.38C14.93 8.76 14.95 9.03 14.88 9.4L14.88 9.41L18.08 5.61C17.24 4.09 15.87 2.93 14.23 2.37L14.22 2.36M9.89 6.89L13.8 2.24L13.76 2.23C13.18 2.08 12.59 2 12 2C10.03 2 8.17 2.85 6.85 4.31L6.83 4.32L9.89 6.89Z" />
        </svg>
        ${text}
        </a></div>`;
}

export function renderName(properties, lang) {
  let name = properties[`name:${lang}`] || properties['name'] || properties['Name'];
  if (name) {
    return `<h1 class="is-size-5 pb-4 px-1 has-text-grey has-text-weight-light">${name}</h1>`
  }
  else {
    return '';
  }
}

export function renderDescription(properties, lang) {
  let description = properties[`description:${lang}`] || properties['description'];
  if (description) {
    return `<p class="px-2 py-2 is-size-7">${description}</p>`
  }
  else {
    return '';
  }
}

export function renderPhoneNumber(properties) {
  const phone = properties['phone'];
  if (phone) {
    const phones = phone.split(';').map(number => `<a href="tel:${number}">${number}</a>`);
    return `<p class="px-2 py-2 is-size-7"><span class="has-text-weight-semibold has-text-grey-dark">${strings.contact_phone[LANG]}</span>: <strong>${phones.join('; ')}</strong></p>`;
  }
  else {
    return '';
  }
}

export function parseOpeningHours(openingHours, lang) {

  if (openingHours) {
    if (openingHours.includes('24/7')) {
      return '24/7';
    } else {
      let hoursPrettified;

      try {
        let hours = openingHours.toString();
        let oh = new opening_hours(hours, undefined, 2);

        hoursPrettified = oh.prettifyValue({
          conf: {
            locale: lang || 'en'
          },
        });

      } catch (error) {
        return openingHours; //Some of the opening_hours are not valid so we just return the original value
      }

      return hoursPrettified;
    }
  } else {
    return undefined;
  }
}

export function renderOpeningHours(properties, lang) {
  let openingHours = parseOpeningHours(properties['opening_hours'], lang);
  if (openingHours) {
    return `<p class="px-2 py-2 is-size-7"><span class="has-text-weight-semibold has-text-grey-dark">${strings.opening_hours[LANG]}</span>: ${openingHours}</p>`
  }
  else {
    return '';
  }
}

export function renderOSMSourceElementURL(osm_id) {
  if (osm_id && RegExp('node|way|relation/[0-9]+').test(osm_id)) {
    return `<a href="https://osm.org/${osm_id}" target="_blank">source</a>`
  } else {
    return ""
  }
}

export function renderBasicPopup(lonlat, properties) {
  const renderGeoUri = !/^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const osmUrl = `https://www.openstreetmap.org/directions?from=&to=${lonlat[1]}%2C${lonlat[0]}#map=14/${lonlat[1]}/${lonlat[0]}`;
  const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lonlat[1]}%2C${lonlat[0]}`;
  let popupHTML = `
        ${renderName(properties, LANG)}
        ${renderPopupRouteLink(`OpenStreetMap ${strings.navigation[LANG]}`, osmUrl)}
        ${renderPopupRouteLink(`Google Maps ${strings.navigation[LANG]}`, gmapsUrl)}
        ${renderGeoUri ? renderPopupRouteLink('GeoURI', `geo:${lonlat[1]},${lonlat[0]}`, true) : ''}
        ${renderPhoneNumber(properties)}
        ${renderDescription(properties, LANG)}
    `;
  if (properties.note) popupHTML += `<p class="pt-4 px-2 pb-2 is-size-7">${properties.note}</p>`;
  if (properties['opening_hours']) popupHTML += renderOpeningHours(properties, LANG);

  if (properties["@id"]) {
    popupHTML += '<hr class="my-1">';
    popupHTML += renderOSMSourceElementURL(properties["@id"]);
  }

  return popupHTML;
}

export function toggleLayer(map, layerId) {
  const currentState = layersVisibilityState[layerId];
  const newState = currentState ? 'none' : 'visible';
  layersDefinitions[layerId].layers.forEach(layer => {
    map.setLayoutProperty(layer.id, 'visibility', newState)
  });
  layersVisibilityState[layerId] = !currentState;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(localStorageLayersItemId, JSON.stringify(layersVisibilityState));
  }
}

export function enableLayer(map, layerId) {
  layersDefinitions[layerId].layers.forEach(layer => {
    map.setLayoutProperty(layer.id, 'visibility', 'visible')
  });
  document.querySelector(`[data-layer-id='${layerId}']`).checked = true;
  layersVisibilityState[layerId] = true;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(localStorageLayersItemId, JSON.stringify(layersVisibilityState));
  }
}

export function disableLayer(map, layerId) {
  layersDefinitions[layerId].layers.forEach(layer => {
    map.setLayoutProperty(layer.id, 'visibility', 'none')
  });
  document.querySelector(`[data-layer-id='${layerId}']`).checked = false;
  layersVisibilityState[layerId] = false;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(localStorageLayersItemId, JSON.stringify(layersVisibilityState));
  }
}

export function toggleSidebar() {
  let sidebar = document.getElementById(sidebarDivId);
  if (sidebar) {
    sidebar.classList.toggle('is-invisible');
    closeNavBurger();
  } else
    console.log('Sidebar not found.');
}

export function closeNavBurger() {
  document.getElementById('navMenu').classList.remove('is-active');
  document.getElementsByClassName('navbar-burger')[0].classList.remove('is-active');
}
