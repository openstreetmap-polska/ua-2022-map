import layers from '../static/style/layers.js';

const controlsLocation = 'bottom-right';

const layersColoursDict = {
    background: '',
    helpPoints: '#ffd500',
    informationPoints: '#ffee00',
    bloodDonation: '#990000',
    socialFacilities: '#00d5ff',
    pharmacies: '#880044',
    hospitals: '#ff1111',
    diplomatic: '#446688',
    charityDropOff: '#11ee11',
};

const LANG = '{{lang}}';

// we need to use url_for so flask freeze will include the file in build
const dummyVariable = "{{ url_for('static', filename='style/layers.js') }}";

function loadLayersVisibilitySave() {
    let state;
    if (typeof localStorage !== 'undefined') {
        state = localStorage.getItem('layers');
        if (state)
            try {
                state = JSON.parse(state);
            } catch (e) {
                console.warn(e);
            }
    }

    if (!state) return {};

    return state;
}

function getLayersState(layers, lang) {
    const definitions = {};
    const visibilities = loadLayersVisibilitySave();

    layers.forEach((layer) => {
        const { group } = layer.metadata;
        const { visibility } = layer.layout;

        if (visibilities.hasOwnProperty(group)) {
            layer.layout.visibility = visibilities[group] ? 'visible' : 'none';
        } else if (!definitions[group]) {
            // takes state from definitions when not present
            visibilities[group] = visibility === 'visible';
        }

        if (definitions[group]) {
            definitions[group].layers.push(layer);
        } else {
            definitions[group] = {
                layers: [layer],
                id: group,
                name: layer.metadata.name[lang],
            };
        }
    });

    return {
        layersDefinitions: definitions,
        layersVisibilityState: visibilities,
    };
}

const { layersDefinitions, layersVisibilityState } = getLayersState(
    layers.layers,
    LANG
);
const layersArray = Object.keys(layersDefinitions).map(
    (id) => layersDefinitions[id]
);

const sidebarDivId = 'sidebar-div';

function loadCenter() {
    let center;
    if (typeof localStorage !== 'undefined') {
        center = localStorage.getItem('center');
        if (center)
            try {
                center = JSON.parse(center);
            } catch (e) {
                console.warn(e);
            }
    }

    if (
        !center ||
        !center.lng ||
        typeof center.lng !== 'number' ||
        !center.lat ||
        typeof center.lat !== 'number'
    )
        return { lng: 24.055, lat: 50.538 };

    return center;
}

function loadZoom() {
    let zoom;
    if (typeof localStorage !== 'undefined') {
        zoom = localStorage.getItem('zoom');
        if (zoom) {
            zoom = parseFloat(zoom);
        }
    }

    if (!zoom || typeof zoom !== 'number') return 7;

    return zoom;
}

const map = new maplibregl.Map({
    container: 'map', // container id
    center: loadCenter(), // starting position [lng, lat]
    zoom: loadZoom(), // starting zoom
    maxZoom: 19, // max zoom to allow
    maxPitch: 0,
    dragRotate: false,
    hash: 'map',
    style: layers,
});

// controlls stuff
// ----------------
// how fast zoom is
map.scrollZoom.setWheelZoomRate(1);

// disable map rotation using right click + drag
map.dragRotate.disable();

// disable map rotation using touch rotation gesture
map.touchZoomRotate.disableRotation();

let control = new maplibregl.NavigationControl({ showCompass: false });
map.addControl(control, controlsLocation);
let geolocate = new maplibregl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true,
    },
});
map.addControl(geolocate, controlsLocation);
// ----------------

// user interaction stuff
// ----------------
Object.entries(layersDefinitions).forEach((x) => {
    if (x[0] !== 'background') {
        map.on('mouseenter', `${x[0]}Circles`, () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', `${x[0]}Circles`, () => {
            map.getCanvas().style.cursor = '';
        });
    }
});

Object.entries(layersDefinitions).forEach((x) => {
    if (x[0] !== 'background') {
        map.on('click', `${x[0]}Circles`, function (e) {
            const lonlat = e.features[0].geometry.coordinates;
            const properties = e.features[0].properties;
            const popupHTML = renderBasicPopup(lonlat, properties);
            new maplibregl.Popup({ maxWidth: '300px' })
                .setLngLat(e.lngLat)
                .setHTML(popupHTML)
                .addTo(map);
        });
    }
});

map.on('load', () => {
    (function setLabelsLangauge(lang) {
        const labelLayers = map
            .getStyle()
            .layers.filter(
                (layer) =>
                    layer.type === 'symbol' &&
                    layer.layout['text-field'] &&
                    layer.id !== 'charityDropOffLabels'
            );
        labelLayers.forEach((layer) =>
            map.setLayoutProperty(layer.id, 'text-field', `{name:${lang}}`)
        );
    })(LANG);
    (function setCharityDropoffPointLabel(lang) {
        map.setLayoutProperty(
            'charityDropOffLabels',
            'text-field',
            `{{strings.charity_drop_off_singular[lang]}} \n {name}`
        );
    })(LANG);
    (function setBackgroudLayerOnInit(lang) {
        const id = lang === 'uk' ? 'osmTilesUk' : 'osmTiles';
        toggleLayer(id);
        document.querySelector(`[data-layer-id='${id}']`).checked = true;
    })(LANG);
});

// saves showed geolocation in local storage
if (typeof localStorage !== 'undefined') {
    const saveCenter = () =>
        localStorage.setItem('center', JSON.stringify(map.getCenter()));
    const saveZoom = () => localStorage.setItem('zoom', map.getZoom());

    // map.on('dragstart', saveCenter);
    map.on('drag', saveCenter);
    // map.on('dragend', saveCenter);

    // map.on('zoomstart', saveZoom);
    map.on('zoom', saveZoom);
    // map.on('zoomend', saveZoom);
}

function renderPopupRouteLink(text, href, hideOnDesktop) {
    return `<div class="p-1">
        <a target="_blank" rel="noopener" class="button p-1 is-fullwidth is-link ${
            hideOnDesktop ? 'is-hidden-desktop' : ''
        }"
        href="${href}">
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M18.27 6C19.28 8.17 19.05 10.73 17.94 12.81C17 14.5 15.65 15.93 14.5 17.5C14 18.2 13.5 18.95 13.13 19.76C13 20.03 12.91 20.31 12.81 20.59C12.71 20.87 12.62 21.15 12.53 21.43C12.44 21.69 12.33 22 12 22H12C11.61 22 11.5 21.56 11.42 21.26C11.18 20.53 10.94 19.83 10.57 19.16C10.15 18.37 9.62 17.64 9.08 16.93L18.27 6M9.12 8.42L5.82 12.34C6.43 13.63 7.34 14.73 8.21 15.83C8.42 16.08 8.63 16.34 8.83 16.61L13 11.67L12.96 11.68C11.5 12.18 9.88 11.44 9.3 10C9.22 9.83 9.16 9.63 9.12 9.43C9.07 9.06 9.06 8.79 9.12 8.43L9.12 8.42M6.58 4.62L6.57 4.63C4.95 6.68 4.67 9.53 5.64 11.94L9.63 7.2L9.58 7.15L6.58 4.62M14.22 2.36L11 6.17L11.04 6.16C12.38 5.7 13.88 6.28 14.56 7.5C14.71 7.78 14.83 8.08 14.87 8.38C14.93 8.76 14.95 9.03 14.88 9.4L14.88 9.41L18.08 5.61C17.24 4.09 15.87 2.93 14.23 2.37L14.22 2.36M9.89 6.89L13.8 2.24L13.76 2.23C13.18 2.08 12.59 2 12 2C10.03 2 8.17 2.85 6.85 4.31L6.83 4.32L9.89 6.89Z" />
        </svg>
        ${text}
        </a></div>`;
}

function renderName(properties, lang) {
    let name =
        properties[`name:${lang}`] || properties['name'] || properties['Name'];
    if (name) {
        return `<h1 class="is-size-5 pb-3">${name}</h1>`;
    } else {
        return '';
    }
}

function renderDescription(properties, lang) {
    let description =
        properties[`description:${lang}`] || properties['description'];
    if (description) {
        return `<p class="pt-3 px-2 pb-2 is-size-7">${description}</p>`;
    } else {
        return '';
    }
}

function renderPhoneNumber(properties) {
    let phone = properties['phone'] || properties['contact:phone'];
    if (phone) {
        return `<p class="py-3 pl-1 is-size-7">{{ strings.contact_phone[lang] }}: <strong><a href="tel:${phone}">${phone}</a></strong></p>`;
    } else {
        return '';
    }
}

function renderBasicPopup(lonlat, properties) {
    const renderGeoUri = !/^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
    );
    const popupHTML = `
        ${renderName(properties, LANG)}
        ${renderPopupRouteLink(
            `OpenStreetMap {{ strings.navigation[lang] }}`,
            `https://www.openstreetmap.org/directions?from=&to=${lonlat[1]}%2C${lonlat[0]}#map=14/${lonlat[1]}/${lonlat[0]}`
        )}
        ${renderPopupRouteLink(
            `Google Maps {{ strings.navigation[lang] }}`,
            `https://www.google.com/maps/dir/?api=1&destination=${lonlat[1]}%2C${lonlat[0]}`
        )}
        ${
            renderGeoUri
                ? renderPopupRouteLink(
                      'GeoURI',
                      `geo:${lonlat[1]},${lonlat[0]}`,
                      true
                  )
                : ''
        }
        ${renderPhoneNumber(properties)}
        ${renderDescription(properties, LANG)}
    `;
    if (properties.note)
        popupHTML += `<p class="pt-4 px-2 pb-2 is-size-7">${properties.note}</p>`;

    return popupHTML;
}

function toggleLayer(layerId) {
    const currentState = layersVisibilityState[layerId];
    const newState = currentState ? 'none' : 'visible';
    layersDefinitions[layerId].layers.forEach((layer) => {
        map.setLayoutProperty(layer.id, 'visibility', newState);
    });
    layersVisibilityState[layerId] = !currentState;
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('layers', JSON.stringify(layersVisibilityState));
    }
}

function toggleSidebar() {
    let sidebar = document.getElementById(sidebarDivId);
    if (sidebar) {
        sidebar.classList.toggle('is-invisible');
        closeNavBurger();
    } else console.log('Sidebar not found.');
}

function closeNavBurger() {
    document.getElementById('navMenu').classList.remove('is-active');
    document
        .getElementsByClassName('navbar-burger')[0]
        .classList.remove('is-active');
}

// --------------------------------------------------------------------------------------
// Bulma controls
document.addEventListener('DOMContentLoaded', () => {
    Array.from(
        document.getElementsByClassName('sidebar-button--toggle')
    ).forEach((element) => element.addEventListener('click', toggleSidebar));
    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(
        document.querySelectorAll('.navbar-burger'),
        0
    );

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
        // Add a click event on each of them
        $navbarBurgers.forEach((el) => {
            el.addEventListener('click', () => {
                // Get the target from the "data-target" attribute
                const target = el.dataset.target;
                const $target = document.getElementById(target);

                // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
            });
        });
    }

    // add listeners to buttons opening modals
    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(
        ($trigger) => {
            const modal = $trigger.dataset.target;
            const $target = document.getElementById(modal);

            $trigger.addEventListener('click', () => {
                $target.classList.add('is-active');
            });
        }
    );

    // Add a click event on various child elements to close the parent modal
    (
        document.querySelectorAll(
            '.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button'
        ) || []
    ).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            $target.classList.remove('is-active');
        });
    });

    // Render legend
    (function legendIife() {
        const legend = document.getElementById('legend__wrapper');
        const list = document.createElement('ul');
        list.classList.add('legend__list');

        function addTogglingListener() {
            list.addEventListener('click', (e) => {
                const target = e.target;
                if (target.tagName === 'INPUT') {
                    const layerId = target.dataset.layerId;
                    toggleLayer(layerId);
                }
            });
        }

        function getLegendItem(id, displayName, visible) {
            const legendItem = document.createElement('li');
            legendItem.classList.add('legend__item');
            legendItem.innerHTML = `
            <label class="checkbox">
                <input ${
                    visible ? 'checked' : ''
                } type="checkbox" data-layer-id=${id}>
                <span class="is-size-6">
                    <div style="background-color: ${
                        layersColoursDict[id]
                    }; width: 15px; height: 15px; display: inline-block; border-radius: 50%;"></div>
                    ${displayName}
                </span>
            </label>`;
            return legendItem;
        }

        function renderLegend(layers) {
            layers.forEach((layer) => {
                const legendItem = getLegendItem(
                    layer.id,
                    layer.name,
                    layersVisibilityState[layer.id]
                );
                list.appendChild(legendItem);
            });
            legend.appendChild(list);
        }

        addTogglingListener();
        renderLegend(layersArray);
    })();
});
