var language = '{{ lang }}';

const customLayerURL = "../static/custom.geojson";
const osmLayerURL = "../data/osm_data.geojson";

const textLayerDefaultLayoutParams = {
    'text-font': ['Open Sans Bold'],
    'text-letter-spacing': 0.05,
    'text-overlap': 'always',
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
    socialFacilities: 'socialFacilities',
}

const sidebarDivId = 'sidebar-div';

const dataLayerIds = [
    layersDict.helpPoints,
];

const usedLayersIds = [layersDict.background, layersDict.helpPoints];

const layersDefinitions = {
        [layersDict.background]: {
            layers: [
                {
                    id: layersDict.background,
                    type: 'raster',
                    source: 'osmTiles',
                    minZoom: 0,
                    maxZoom: 19,
                },
            ],
            name: 'OSM Carto tiles', // todo: localize layer name
            id: layersDict.background,
            before: layersDict.helpPoints
        },
        [layersDict.helpPoints]: {
            layers: [
                {
                    id: `${layersDict.helpPoints}Circles`,
                    type: 'circle',
                    source: 'custom',
                    paint: {
                        'circle-color': '#ffd500',
                        'circle-radius': 18,
                        'circle-stroke-color': '#fff',
                        'circle-stroke-width': 3,
                    },
                    filter: ['==', 'custom', 'punkt recepcyjny'],
                }, {
                    id: `${layersDict.helpPoints}Labels`,
                    type: 'symbol',
                    source: 'custom',
                    minzoom: 5,
                    layout: {
                        'text-field': '{name:{{ lang }}}',
                        'text-offset': [0, 3],
                        'text-size': 11,
                        ...textLayerDefaultLayoutParams,
                    },
                    paint: textLayerDefaultPaint,
                    filter: ['==', 'custom', 'punkt recepcyjny'],
                },
            ],
            name: 'Punkty pomocy', // todo: localize layer name
            id: layersDict.helpPoints,
        },
        [layersDict.socialFacilities]: {
            layers: [
                {
                    id: `${layersDict.socialFacilities}Circles`,
                    type: 'circle',
                    source: 'osmData',
                    paint: {
                        'circle-color': '#00d5ff',
                        'circle-radius': 10,
                        'circle-stroke-color': '#fff',
                        'circle-stroke-width': 3,
                    },
                    filter: ['==', ['get', 'amenity'], 'social_facility'],
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
                    },
                    paint: textLayerDefaultPaint,
                    filter: ['==', ['get', 'amenity'], 'social_facility'],
                },
            ],
            name: 'Placówki opieki społecznej', // todo: localize layer name
            id: layersDict.socialFacilities,
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
map.on('mouseenter', `${layersDict.helpPoints}Circles`, () => {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', `${layersDict.helpPoints}Circles`, () => {
    map.getCanvas().style.cursor = '';
});

map.on('click', `${layersDict.helpPoints}Circles`, function (e) {
    const lonlat = e.features[0].geometry.coordinates;
    const properties = e.features[0].properties;
    const namePl = e.features[0].properties['name:pl'];
    const nameUk = e.features[0].properties['name:uk'];
    const popupHTML = `
        <h1 class="is-size-5 pb-2">${nameUk}</h1>
        <h2 class="is-size-6 pb-3">${namePl}</h2>
        ${renderOSMRouteLink(lonlat, properties)}
        ${renderGoogleRouteLink(lonlat, properties)}
        <p class="pt-4 px-2 pb-2 is-size-7">${properties.description}</p>
    `;
    new maplibregl.Popup({maxWidth: '300px'})
        .setLngLat(e.lngLat)
        .setHTML(popupHTML)
        .addTo(map);
});
// ----------------
function renderOSMRouteLink(lonlat, properties) {
    return `<div class="p-1"><a target="_blank" rel="noopener" class="button p-1 is-fullwidth is-link"
        href="https://www.openstreetmap.org/directions?from=&to=${lonlat[1]}%2C${lonlat[0]}#map=14/${lonlat[1]}/${lonlat[0]}">
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M15.5,12C18,12 20,14 20,16.5C20,17.38 19.75,18.21 19.31,18.9L22.39,22L21,23.39L17.88,20.32C17.19,20.75 16.37,21 15.5,21C13,21 11,19 11,16.5C11,14 13,12 15.5,12M15.5,14A2.5,2.5 0 0,0 13,16.5A2.5,2.5 0 0,0 15.5,19A2.5,2.5 0 0,0 18,16.5A2.5,2.5 0 0,0 15.5,14M14,6.11L8,4V15.89L9,16.24V16.5C9,17.14 9.09,17.76 9.26,18.34L8,17.9L2.66,19.97L2.5,20A0.5,0.5 0 0,1 2,19.5V4.38C2,4.15 2.15,3.97 2.36,3.9L8,2L14,4.1L19.34,2H19.5A0.5,0.5 0 0,1 20,2.5V11.81C18.83,10.69 17.25,10 15.5,10C15,10 14.5,10.06 14,10.17V6.11Z" />
        </svg>
        OpenStreetMap {{ strings.navigation[lang] }}
        </a></div>`;
}

function renderGoogleRouteLink(lonlat, properties) {
    return `<div class="p-1">
        <a target="_blank" rel="noopener" class="button p-1 is-fullwidth is-link"
        href="https://www.google.com/maps/dir/?api=1&destination=${lonlat[1]}%2C${lonlat[0]}">
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M18.27 6C19.28 8.17 19.05 10.73 17.94 12.81C17 14.5 15.65 15.93 14.5 17.5C14 18.2 13.5 18.95 13.13 19.76C13 20.03 12.91 20.31 12.81 20.59C12.71 20.87 12.62 21.15 12.53 21.43C12.44 21.69 12.33 22 12 22H12C11.61 22 11.5 21.56 11.42 21.26C11.18 20.53 10.94 19.83 10.57 19.16C10.15 18.37 9.62 17.64 9.08 16.93L18.27 6M9.12 8.42L5.82 12.34C6.43 13.63 7.34 14.73 8.21 15.83C8.42 16.08 8.63 16.34 8.83 16.61L13 11.67L12.96 11.68C11.5 12.18 9.88 11.44 9.3 10C9.22 9.83 9.16 9.63 9.12 9.43C9.07 9.06 9.06 8.79 9.12 8.43L9.12 8.42M6.58 4.62L6.57 4.63C4.95 6.68 4.67 9.53 5.64 11.94L9.63 7.2L9.58 7.15L6.58 4.62M14.22 2.36L11 6.17L11.04 6.16C12.38 5.7 13.88 6.28 14.56 7.5C14.71 7.78 14.83 8.08 14.87 8.38C14.93 8.76 14.95 9.03 14.88 9.4L14.88 9.41L18.08 5.61C17.24 4.09 15.87 2.93 14.23 2.37L14.22 2.36M9.89 6.89L13.8 2.24L13.76 2.23C13.18 2.08 12.59 2 12 2C10.03 2 8.17 2.85 6.85 4.31L6.83 4.32L9.89 6.89Z" />
        </svg>
        Google Maps {{ strings.navigation[lang] }}
        </a></div>`;
}

function toggleLayer(layerId) {
    const currentState = map.getLayoutProperty(layersDefinitions[layerId].layers[0].id, 'visibility')
    const newState = !currentState || currentState === 'visible' ? 'none' : 'visible';
    layersDefinitions[layerId].layers.forEach(layer => {
        map.setLayoutProperty(layer.id, 'visibility', newState)
    });
}

function showSidebar() {
    let sidebar = document.getElementById(sidebarDivId);
    if (sidebar) {
        sidebar.classList.remove('is-invisible');
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
        function getLegendItem(id, displayName) {
            const legendItem = document.createElement('li');
            legendItem.classList.add('legend__item');
            legendItem.innerHTML = `
            <label class="checkbox">
                <input checked type="checkbox" data-layer-id=${id}>
                <span class="is-size-6">
                    ${displayName}
                </span>
            </label>`;
            return legendItem
        }
    
        function renderLegend(layers) {
            layers.forEach(layer => {
            const legendItem = getLegendItem(layer.id, layer.name)
                list.appendChild(legendItem)
            })
            legend.appendChild(list)
        }
        
        list.addEventListener('click', e => {
            const target = e.target;
            if (target.tagName === 'INPUT') {
                const layerId = target.dataset.layerId
                toggleLayer(layerId);
            }
        })
        renderLegend(usedLayersDefs)
      })();
});
