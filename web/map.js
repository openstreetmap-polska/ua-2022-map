const textLayerDefaultLayoutParams = {
    'text-font': ['Open Sans Bold'],
    'text-size': 11,
    'text-letter-spacing': 0.05,
    'text-overlap': 'always',
};
const textLayerDefaultPaint = {
    'text-color': '#050505',
    'text-halo-color': 'rgba(255, 255, 255, 0.9)',
    'text-halo-width': 2,
};

const controlsLocation = 'bottom-right';
const backgroundLayerId = 'background';
const helpPointsLayerId = 'helpPoints';

const layerStyles = {
    [backgroundLayerId]: {
        layers: [
            {
                id: backgroundLayerId,
                type: 'raster',
                source: 'osmTiles',
                minZoom: 0,
                maxZoom: 19,
            },
        ],
        name: 'Background',
    },
    [helpPointsLayerId]: {
        layers: [
            {
                id: helpPointsLayerId + 'Circles',
                type: 'circle',
                source: 'custom',
                paint: {
                    'circle-color': 'rgba(255, 0, 0, 0.9)',
                    'circle-radius': 18,
                    'circle-stroke-color': 'rgba(245, 245, 245, 0.88)',
                    'circle-stroke-width': 2,
                },
                filter: ['==', 'custom', 'punkt recepcyjny'],
            }, {
                id: helpPointsLayerId + 'Labels',
                type: 'symbol',
                source: 'custom',
                layout: {
                    'text-field': '{name}',
                    ...textLayerDefaultLayoutParams,
                },
                paint: textLayerDefaultPaint,
                filter: ['==', 'custom', 'punkt recepcyjny'],
            },
        ],
        name: 'Punkty pomocy',
    },
};
const initialMapLayers = [
    ...layerStyles[backgroundLayerId].layers,
    ...layerStyles[helpPointsLayerId].layers,
];


var map = new maplibregl.Map({
    container: 'map', // container id
    center: [24.055, 50.538], // starting position [lng, lat]
    zoom: 8, // starting zoom
    maxZoom: 19, // max zoom to allow
    maxPitch: 0,
    dragRotate: false,
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
            custom: {
                type: 'geojson',
                data: './custom.geojson',
                maxzoom: 12,
                generateId: true,
            },
        },
        layers: initialMapLayers,
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
map.on('mouseenter', helpPointsLayerId + 'Circles', () => {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', helpPointsLayerId + 'Circles', () => {
    map.getCanvas().style.cursor = '';
});

map.on('click', helpPointsLayerId + 'Circles', function (e) {
    console.log(e.features[0]);
    const lonlat = e.features[0].geometry.coordinates;
    const popupHTML = `
        ${renderOSMRouteLink(lonlat)}
        <br>
        ${renderGoogleRouteLink(lonlat)}
    `;
    new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(popupHTML)
        .addTo(map);
});
// ----------------
function renderOSMRouteLink(lonlat) {
    return `<a target="_blank" rel="noopener" href="https://www.openstreetmap.org/directions?from=&to=${lonlat[1]}%2C${lonlat[0]}#map=14/${lonlat[1]}/${lonlat[0]}">OpenStreetMap Navigation</a>`;
}

function renderGoogleRouteLink(lonlat) {
    return `<a target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${lonlat[1]}%2C${lonlat[0]}">Google Maps Navigation</a>`;
}

function toggleLayer(layerId) {
    layerStyles[layerId].layers.forEach(layer => {
        if (map.getLayer(layer.id)) {
            console.log("Removing " + layer.id + " layer from map.");
            map.removeLayer(layer.id);
        } else {
            console.log("Adding " + layer.id + " layer to map.");
            map.addLayer(layer);
        }
    });
}
