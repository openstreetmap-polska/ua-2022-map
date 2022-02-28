var language = '{{ lang }}';

const customLayerURL = "{{ url_for('static', filename='custom.geojson') }}";
const osmLayerURL = "{{ url_for('get_osm_data_geojson') }}";

const textLayerDefaultLayoutParams = {
    'text-font': ['Open Sans Bold'],
    'text-letter-spacing': 0.05,
};
const textLayerDefaultPaint = {
    'text-color': '#050505',
    'text-halo-color': 'rgba(255, 255, 255, 0.9)',
    'text-halo-width': 2,
};

const controlsLocation = 'bottom-right';

const layersDict = {
    background: 'background',
    helpPoints: 'helpPoints',
    informationPoints: 'informationPoints',
    bloodDonation: 'bloodDonation',
    socialFacilities: 'socialFacilities',
    pharmacies: 'pharmacies',
    hospitals: 'hospitals',
    diplomatic: 'diplomatic',
    charityDropOff: 'charityDropOff',
}

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
}

const layersVisibilityOnInit = {
    [layersDict.background]: true,
    [layersDict.helpPoints]: true,
    [layersDict.informationPoints]: true,
    [layersDict.bloodDonation]: false,
    [layersDict.socialFacilities]: true,
    [layersDict.pharmacies]: false,
    [layersDict.hospitals]: false,
    [layersDict.diplomatic]: true,
    [layersDict.charityDropOff]: true,
}

function getIsLayerVisibleOnInit(id) {
    return layersVisibilityOnInit[id] ? 'visible' : 'none';
}

const sidebarDivId = 'sidebar-div';

const usedLayersIds = [
    layersDict.background,
    layersDict.helpPoints,
    layersDict.informationPoints,
    layersDict.bloodDonation,
    layersDict.socialFacilities,
    layersDict.pharmacies,
    layersDict.hospitals,
    layersDict.diplomatic,
    layersDict.charityDropOff,
];

const layersDefinitions = {
        [layersDict.background]: {
            layers: [
                {
                    id: layersDict.background,
                    type: 'raster',
                    source: 'osmTiles',
                    minZoom: 0,
                    maxZoom: 19,
                    layout: {
                        visibility: getIsLayerVisibleOnInit(layersDict.background)
                    }
                },
            ],
            name: 'OSM Carto {{ strings.map[lang] }}',
            id: layersDict.background,
            before: layersDict.helpPoints
        },
        [layersDict.helpPoints]: {
            layers: [
                {
                    id: `${layersDict.helpPoints}Circles`,
                    type: 'circle',
                    source:  'osmData',
                    paint: {
                        'circle-color': layersColoursDict.helpPoints,
                        'circle-radius': 12,
                        'circle-stroke-color': '#fff',
                        'circle-stroke-width': 3,
                    },
                    layout: {
                        visibility: getIsLayerVisibleOnInit(layersDict.helpPoints)
                    },
                        filter: ['all', ['==', ['get', 'social_facility'], 'outreach'], ['==', ['get', 'social_facility:for'], 'refugee']],
                    },
                    {
                    id: `${layersDict.helpPoints}Labels`,
                    type: 'symbol',
                    source: 'osmData',
                    minzoom: 5,
                    layout: {
                        'text-field': '{name:{{ lang }}}',
                        'text-offset': [0, 3],
                        'text-size': 10,
                        ...textLayerDefaultLayoutParams,
                        visibility: getIsLayerVisibleOnInit(layersDict.helpPoints)
                    },
                    paint: textLayerDefaultPaint,
                    filter: ['all', ['==', ['get', 'social_facility'], 'outreach'], ['==', ['get', 'social_facility:for'], 'refugee']],
                },
            ],
            name: '{{ strings.reception_points[lang] }}',
            id: layersDict.helpPoints,
        },
        [layersDict.informationPoints]: {
            layers: [
                {
                    id: `${layersDict.informationPoints}Circles`,
                    type: 'circle',
                    source: 'osmData',
                    paint: {
                        'circle-color': layersColoursDict.informationPoints,
                        'circle-radius': 9,
                        'circle-stroke-color': '#fff',
                        'circle-stroke-width': 2,
                    },
                    layout: {
                        visibility: getIsLayerVisibleOnInit(layersDict.informationPoints)
                    },
                    filter: ['==', ['get', 'information:for'], 'refugees'],
                }, {
                    id: `${layersDict.informationPoints}Labels`,
                    type: 'symbol',
                    source: 'osmData',
                    minzoom: 5,
                    layout: {
                        'text-field': '{name:{{ lang }}}',
                        'text-offset': [0, 3],
                        'text-size': 10,
                        ...textLayerDefaultLayoutParams,
                        visibility: getIsLayerVisibleOnInit(layersDict.informationPoints)
                    },
                    paint: textLayerDefaultPaint,
                    filter: ['==', ['get', 'information:for'], 'refugees'],
                },
            ],
            name: '{{ strings.information_points[lang] }}',
            id: layersDict.informationPoints,
        },
        [layersDict.bloodDonation]: {
            layers: [
                {
                    id: `${layersDict.bloodDonation}Circles`,
                    type: 'circle',
                    source: 'osmData',
                    paint: {
                        'circle-color': layersColoursDict.bloodDonation,
                        'circle-radius': 6,
                        'circle-stroke-color': '#fff',
                        'circle-stroke-width': 2,
                    },
                    layout: {
                        visibility: getIsLayerVisibleOnInit(layersDict.bloodDonation)
                    },
                    filter: ['==', ['get', 'healthcare'], 'blood_donation'],
                }, {
                    id: `${layersDict.bloodDonation}Labels`,
                    type: 'symbol',
                    source: 'osmData',
                    minzoom: 5,
                    layout: {
                        'text-field': '{name:{{ lang }}}',
                        'text-offset': [0, 3],
                        'text-size': 7,
                        ...textLayerDefaultLayoutParams,
                        visibility: getIsLayerVisibleOnInit(layersDict.bloodDonation)
                    },
                    paint: textLayerDefaultPaint,
                    filter: ['==', ['get', 'healthcare'], 'blood_donation'],
                },
            ],
            name: '{{ strings.blood_donation[lang] }}',
            id: layersDict.bloodDonation,
        },
        [layersDict.socialFacilities]: {
            layers: [
                {
                    id: `${layersDict.socialFacilities}Circles`,
                    type: 'circle',
                    source: 'osmData',
                    paint: {
                        'circle-color': layersColoursDict.socialFacilities,
                        'circle-radius': 7,
                        'circle-stroke-color': '#fff',
                        'circle-stroke-width': 2,
                    },
                    layout: {
                        visibility: getIsLayerVisibleOnInit(layersDict.socialFacilities)
                    },
                    filter: [
                        'any',
                        ['in', ['get', 'social_facility'], ['literal', ['shelter', 'food_bank', 'soup_kitchen']]],
                        ['==', ['get', 'social_facility:for'], 'refugees'],
                    ],
                }, {
                    id: `${layersDict.socialFacilities}Labels`,
                    type: 'symbol',
                    source: 'osmData',
                    minzoom: 5,
                    layout: {
                        'text-field': '{name:{{ lang }}}',
                        'text-offset': [0, 3],
                        'text-size': 8,
                        ...textLayerDefaultLayoutParams,
                        visibility: getIsLayerVisibleOnInit(layersDict.socialFacilities)
                    },
                    paint: textLayerDefaultPaint,
                    filter: [
                        'any',
                        ['in', ['get', 'social_facility'], ['literal', ['shelter', 'food_bank', 'soup_kitchen']]],
                        ['==', ['get', 'social_facility:for'], 'refugees'],
                    ],
                },
            ],
            name: '{{ strings.social_facilities[lang] }}',
            id: layersDict.socialFacilities,
        },
        [layersDict.pharmacies]: {
            layers: [
                {
                    id: `${layersDict.pharmacies}Circles`,
                    type: 'circle',
                    source: 'osmData',
                    paint: {
                        'circle-color': layersColoursDict.pharmacies,
                        'circle-radius': 5,
                        'circle-stroke-color': '#fff',
                        'circle-stroke-width': 1,
                    },
                    layout: {
                        visibility: getIsLayerVisibleOnInit(layersDict.pharmacies)
                    },
                    filter: ['==', ['get', 'amenity'], 'pharmacy'],
                }, {
                    id: `${layersDict.pharmacies}Labels`,
                    type: 'symbol',
                    source: 'osmData',
                    minzoom: 5,
                    layout: {
                        'text-field': '{name:{{ lang }}}',
                        'text-offset': [0, 3],
                        'text-size': 7,
                        ...textLayerDefaultLayoutParams,
                        visibility: getIsLayerVisibleOnInit(layersDict.pharmacies)
                    },
                    paint: textLayerDefaultPaint,
                    filter: ['==', ['get', 'amenity'], 'pharmacy'],
                },
            ],
            name: '{{ strings.pharmacies[lang] }}',
            id: layersDict.pharmacies,
        },
        [layersDict.hospitals]: {
            layers: [
                {
                    id: `${layersDict.hospitals}Circles`,
                    type: 'circle',
                    source: 'osmData',
                    paint: {
                        'circle-color': layersColoursDict.hospitals,
                        'circle-radius': 8,
                        'circle-stroke-color': '#fff',
                        'circle-stroke-width': 2,
                    },
                    layout: {
                        visibility: getIsLayerVisibleOnInit(layersDict.hospitals)
                    },
                    filter: ['==', ['get', 'amenity'], 'hospital'],
                }, {
                    id: `${layersDict.hospitals}Labels`,
                    type: 'symbol',
                    source: 'osmData',
                    minzoom: 5,
                    layout: {
                        'text-field': '{name:{{ lang }}}',
                        'text-offset': [0, 3],
                        'text-size': 8,
                        ...textLayerDefaultLayoutParams,
                        visibility: getIsLayerVisibleOnInit(layersDict.hospitals)
                    },
                    paint: textLayerDefaultPaint,
                    filter: ['==', ['get', 'amenity'], 'hospital'],
                },
            ],
            name: '{{ strings.hospitals[lang] }}',
            id: layersDict.hospitals,
        },
        [layersDict.diplomatic]: {
            layers: [
                {
                    id: `${layersDict.diplomatic}Circles`,
                    type: 'circle',
                    source: 'osmData',
                    paint: {
                        'circle-color': layersColoursDict.diplomatic,
                        'circle-radius': 10,
                        'circle-stroke-color': '#fff',
                        'circle-stroke-width': 2,
                    },
                    layout: {
                        visibility: getIsLayerVisibleOnInit(layersDict.diplomatic)
                    },
                    filter: ['all', ['==', ['get', 'office'], 'diplomatic'], ['==', ['get', 'country'], 'UA']],
                }, {
                    id: `${layersDict.diplomatic}Labels`,
                    type: 'symbol',
                    source: 'osmData',
                    minzoom: 5,
                    layout: {
                        'text-field': '{name:{{ lang }}}',
                        'text-offset': [0, 3],
                        'text-size': 8,
                        ...textLayerDefaultLayoutParams,
                        visibility: getIsLayerVisibleOnInit(layersDict.diplomatic)
                    },
                    paint: textLayerDefaultPaint,
                    filter: ['all', ['==', ['get', 'office'], 'diplomatic'], ['==', ['get', 'country'], 'UA']],
                },
            ],
            name: '{{ strings.consulate[lang] }}',
            id: layersDict.diplomatic,
        },
        [layersDict.charityDropOff]: {
            layers: [
                {
                    id: `${layersDict.charityDropOff}Circles`,
                    type: 'circle',
                    source: 'charityDropOff',
                    paint: {
                        'circle-color': layersColoursDict.charityDropOff,
                        'circle-radius': 7,
                        'circle-stroke-color': '#fff',
                        'circle-stroke-width': 2,
                    },
                    layout: {
                        visibility: getIsLayerVisibleOnInit(layersDict.charityDropOff)
                    },
                }, {
                    id: `${layersDict.charityDropOff}Labels`,
                    type: 'symbol',
                    source: 'charityDropOff',
                    minzoom: 5,
                    layout: {
                        'text-field': '{{ strings.charity_drop_off_singular[lang] }} \n {Name}',
                        'text-offset': [0, 3.5],
                        'text-size': 8,
                        ...textLayerDefaultLayoutParams,
                        visibility: getIsLayerVisibleOnInit(layersDict.charityDropOff)
                    },
                    paint: textLayerDefaultPaint,
                },
            ],
            name: '{{ strings.charity_drop_off[lang] }}',
            id: layersDict.charityDropOff,
        },
};

const usedLayersDefs = usedLayersIds.map(layerId => layersDefinitions[layerId]);
const separatedLayersDefs = usedLayersDefs.reduce((acc, layer) => [...acc, ...layer.layers], []);

var map = new maplibregl.Map({
    container: 'map', // container id
    center: [24.055, 50.538], // starting position [lng, lat]
    zoom: 7, // starting zoom
    maxZoom: 19, // max zoom to allow
    maxPitch: 0,
    dragRotate: false,
    hash: 'map',
    style: {
        version: 8,
        glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
        sources: {
            osmTiles: {
                type: 'raster',
                tiles: [
                    'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
                ],
                tileSize: 256,
                maxzoom: 19,
                paint: {
                    'raster-fade-duration': 100
                },
                attribution: `data © <a target="_top" rel="noopener" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.`,
            },
            mediaWikiTiles: {
                type: 'raster',
                tiles: [
                    'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang=uk'
                ],
                tileSize: 256,
                maxzoom: 19,
                paint: {
                    'raster-fade-duration': 100
                },
                attribution: `map: <a target="_top" rel="noopener" href="https://foundation.wikimedia.org/wiki/Maps_Terms_of_Use">WikiMedia</a>; data: © <a target="_top" rel="noopener" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.`,
            },
            custom: {
                type: 'geojson',
                data: customLayerURL,
                maxzoom: 12,
                generateId: true,
            },
            osmData: {
                type: 'geojson',
                data: osmLayerURL,
                maxzoom: 12,
            },
            charityDropOff: {
                type: 'geojson',
                data: 'https://dopomoha.pl/data/zbiorki.geojson',
                maxzoom: 12,
            },
        },
        layers: separatedLayersDefs,
    },
});

// controlls stuff
// ----------------
// how fast zoom is
map.scrollZoom.setWheelZoomRate(1);

// disable map rotation using right click + drag
map.dragRotate.disable();

// disable map rotation using touch rotation gesture
map.touchZoomRotate.disableRotation();

let control = new maplibregl.NavigationControl({showCompass: false});
map.addControl(control, controlsLocation);
let geolocate = new maplibregl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    }
});
map.addControl(geolocate, controlsLocation);
// ----------------

// user interaction stuff
// ----------------
Object.entries(layersDict).forEach(x => {
    if (x[1] !== 'background') {
        map.on('mouseenter', `${x[1]}Circles`, () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', `${x[1]}Circles`, () => {
            map.getCanvas().style.cursor = '';
        });
    }
});

Object.entries(layersDict).forEach(x => {
    if (x[1] !== 'background') {
        map.on('click', `${x[1]}Circles`, function (e) {
            const lonlat = e.features[0].geometry.coordinates;
            const properties = e.features[0].properties;
            const popupHTML = renderBasicPopup(lonlat, properties);
            new maplibregl.Popup({maxWidth: '300px'})
                .setLngLat(e.lngLat)
                .setHTML(popupHTML)
                .addTo(map);
        });
    }
});
// ----------------

function renderPopupRouteLink(text, href, hideOnDesktop) {
    return `<div class="p-1">
        <a target="_blank" rel="noopener" class="button p-1 is-fullwidth is-link ${hideOnDesktop ? 'is-hidden-desktop' : ''}"
        href="${href}">
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M18.27 6C19.28 8.17 19.05 10.73 17.94 12.81C17 14.5 15.65 15.93 14.5 17.5C14 18.2 13.5 18.95 13.13 19.76C13 20.03 12.91 20.31 12.81 20.59C12.71 20.87 12.62 21.15 12.53 21.43C12.44 21.69 12.33 22 12 22H12C11.61 22 11.5 21.56 11.42 21.26C11.18 20.53 10.94 19.83 10.57 19.16C10.15 18.37 9.62 17.64 9.08 16.93L18.27 6M9.12 8.42L5.82 12.34C6.43 13.63 7.34 14.73 8.21 15.83C8.42 16.08 8.63 16.34 8.83 16.61L13 11.67L12.96 11.68C11.5 12.18 9.88 11.44 9.3 10C9.22 9.83 9.16 9.63 9.12 9.43C9.07 9.06 9.06 8.79 9.12 8.43L9.12 8.42M6.58 4.62L6.57 4.63C4.95 6.68 4.67 9.53 5.64 11.94L9.63 7.2L9.58 7.15L6.58 4.62M14.22 2.36L11 6.17L11.04 6.16C12.38 5.7 13.88 6.28 14.56 7.5C14.71 7.78 14.83 8.08 14.87 8.38C14.93 8.76 14.95 9.03 14.88 9.4L14.88 9.41L18.08 5.61C17.24 4.09 15.87 2.93 14.23 2.37L14.22 2.36M9.89 6.89L13.8 2.24L13.76 2.23C13.18 2.08 12.59 2 12 2C10.03 2 8.17 2.85 6.85 4.31L6.83 4.32L9.89 6.89Z" />
        </svg>
        ${text}
        </a></div>`;
}

function renderName(properties, lang) {
    let name = properties[`name:${lang}`] || properties['name'] || properties['Name'];
    if (name) {
        return `<h1 class="is-size-5 pb-3">${name}</h1>`
    }
    else
    {
        return '';
    }
}

function renderDescription(properties, lang) {
    let description = properties[`description:${lang}`] || properties['description'];
    if (description) {
        return `<p class="pt-3 px-2 pb-2 is-size-7">${description}</p>`
    }
    else
    {
        return '';
    }
}

function renderPhoneNumber(properties) {
    let phone = properties['phone'] || properties['contact:phone'];
    if (phone) {
        return `<p class="py-3 pl-1 is-size-7">{{ strings.contact_phone[lang] }}: <strong><a href="tel:${phone}">${phone}</a></strong></p>`
    }
    else
    {
        return '';
    }
}

function renderBasicPopup(lonlat, properties) {
    const renderGeoUri = !/^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    const popupHTML = `
        ${renderName(properties, language)}
        ${renderPopupRouteLink(`OpenStreetMap {{ strings.navigation[lang] }}`, `https://www.openstreetmap.org/directions?from=&to=${lonlat[1]}%2C${lonlat[0]}#map=14/${lonlat[1]}/${lonlat[0]}`)}
        ${renderPopupRouteLink(`Google Maps {{ strings.navigation[lang] }}`, `https://www.google.com/maps/dir/?api=1&destination=${lonlat[1]}%2C${lonlat[0]}`)}
        ${renderGeoUri ? renderPopupRouteLink('GeoURI', `geo:${lonlat[1]},${lonlat[0]}`, true) : ''}
        ${renderPhoneNumber(properties)}
        ${renderDescription(properties, language)}
    `;
    if (properties.note) popupHTML += `<p class="pt-4 px-2 pb-2 is-size-7">${properties.note}</p>`;

    return popupHTML;
}

function toggleLayer(layerId) {
    const currentState = map.getLayoutProperty(layersDefinitions[layerId].layers[0].id, 'visibility')
    const newState = !currentState || currentState === 'visible' ? 'none' : 'visible';
    layersDefinitions[layerId].layers.forEach(layer => {
        map.setLayoutProperty(layer.id, 'visibility', newState)
    });
}

function toggleSidebar() {
    let sidebar = document.getElementById(sidebarDivId);
    if (sidebar) {
        sidebar.classList.toggle('is-invisible');
        closeNavBurger();
    } else
        console.log('Sidebar not found.');
}

function hideSidebar() {
    let sidebar = document.getElementById(sidebarDivId);
    if (sidebar) {
        sidebar.classList.add('is-invisible');
    } else {
        console.log('Sidebar not found.');
    }
}

function closeNavBurger() {
    document.getElementById('navMenu').classList.remove('is-active');
    document.getElementsByClassName('navbar-burger')[0].classList.remove('is-active');
}

// --------------------------------------------------------------------------------------
// Bulma controls
document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach(el => {
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
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);

        $trigger.addEventListener('click', () => {
            $target.classList.add('is-active');
        });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            $target.classList.remove('is-active');
        });
    });

    // Render legend
    (function legendIife() {
        const legend = document.getElementById('legend__wrapper');
        const list = document.createElement('ul');
        list.classList.add('legend__list')

        function addTogglingListener() {
            list.addEventListener('click', e => {
                const target = e.target;
                if (target.tagName === 'INPUT') {
                    const layerId = target.dataset.layerId
                    toggleLayer(layerId);
                }
            })
         }

        function getLegendItem(id, displayName, visible) {
            const legendItem = document.createElement('li');
            legendItem.classList.add('legend__item');
            legendItem.innerHTML = `
            <label class="checkbox">
                <input ${visible ? 'checked' : ''} type="checkbox" data-layer-id=${id}>
                <span class="is-size-6">
                    <div style="background-color: ${layersColoursDict[id]}; width: 15px; height: 15px; display: inline-block; border-radius: 50%;"></div>
                    ${displayName}
                </span>
            </label>`;
            return legendItem
        }

        function renderLegend(layers) {
            layers.forEach(layer => {
            const legendItem = getLegendItem(layer.id, layer.name, layersVisibilityOnInit[layer.id])
                list.appendChild(legendItem)
            })
            legend.appendChild(list)
        }

        addTogglingListener()
        renderLegend(usedLayersDefs)
      })();
});
