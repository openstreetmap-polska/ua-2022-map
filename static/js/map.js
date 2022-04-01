import layers from '../style/layers.js'
import { layersArray, layersDefinitions, layersVisibilityState } from './layers.js';
import { controlsLocation, modesSettings, sidebarDivId } from './constants.js';
import { geocoder_api } from './geocoder_api.js';
import { disableLayer, enableLayer, renderBasicPopup } from './functions.js';
import { legendFactory } from './legend.js';
import { bulmaBootstrap } from './bulma_init.js';

legendFactory(layersArray, layersVisibilityState);
document.addEventListener('DOMContentLoaded', function() { bulmaBootstrap(getMode); });

function toggleMode(map) {
  const modes = {
    'forUkrainian': 'forPole',
    'forPole': 'forUkrainian',
  }
  const newMode = modes[getMode()];
  const settings = modesSettings[newMode];
  settings.layersToDisable.forEach(layerGroupId => disableLayer(map, layerGroupId));
  settings.layersToEnable.forEach(layerGroupId => enableLayer(map, layerGroupId));
  saveMode(newMode);
}

function getMode() {
  let mode;
  if (typeof localStorage !== 'undefined') {
    mode = localStorage.getItem('mode');
  }

  if (!mode) {
    return 'forUkrainian';
  }

  return mode;
}

function saveMode(mode) {
  localStorage.setItem('mode', mode);
}

function loadCenter() {
  let center;
  const defaultCenter = { lng: 24.055, lat: 50.538 };

  if (typeof localStorage !== 'undefined') {
    center = localStorage.getItem("center");
    if (center) {
      try {
        center = {
          ...defaultCenter,
          ...JSON.parse(center, (key, value) => (key.match(/lng|lat|^$/) && value) ? value : undefined)
        };
      } catch (e) {
        console.warn(e);
        center = defaultCenter;
      }
    }
  }

  return center;
}

function loadZoom() {
  let zoom;
  if (typeof localStorage !== 'undefined') {
    zoom = localStorage.getItem("zoom");
    if (zoom) {
      zoom = parseFloat(zoom);
    }
  }
  if (!zoom || typeof zoom !== 'number') {
    return 7;
  }
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
  style: layers
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
let scaleControl = new maplibregl.ScaleControl();
let geolocate = new maplibregl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  }
});

// add controls
map.addControl(scaleControl, controlsLocation);
map.addControl(control, controlsLocation);
map.addControl(new MaplibreGeocoder(geocoder_api, { maplibregl: maplibregl }));
map.addControl(geolocate, controlsLocation);


// ----------------

// user interaction stuff
// ----------------
Object.entries(layersDefinitions).forEach(x => {
  if (!x[0].includes("Tiles")) {
    map.on('mouseenter', `${x[0]}Circles`, () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', `${x[0]}Circles`, () => {
      map.getCanvas().style.cursor = '';
    });
    map.on('mouseenter', `${x[0]}Clusters`, () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', `${x[0]}Clusters`, () => {
      map.getCanvas().style.cursor = '';
    });
  }
});

Object.entries(layersDefinitions).forEach(x => {
  if (!x[0].includes("Tiles")) {
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
  // click on cluster zooms to the cluster
  if (!x[0].includes("Tiles")) {
    map.on('click', `${x[0]}Clusters`, function (e) {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [`${x[0]}Clusters`]
      });
      const clusterId = features[0].properties.cluster_id;
      const sourceId = features[0].layer.source;
      map.getSource(sourceId).getClusterExpansionZoom(
        clusterId,
        function (err, zoom) {
          if (err) return;
          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom + 1 // felt like just zoom wasn't zooming enough
          });
        }
      );
    });
  }
});

map.on('load', () => {
  (function setLabelsLangauge(lang) {
    const labelLayers = map.getStyle().layers.filter(layer => layer.type === 'symbol' && layer.layout['text-field'] && layer.id !== 'charityDropOffLabels')
    labelLayers.forEach(layer => map.setLayoutProperty(layer.id, 'text-field', `{name:${lang}}`));
  })(LANG);
  (function setCharityDropoffPointLabel(lang) {
    map.setLayoutProperty("charityDropOffLabels", 'text-field', `${strings.charity_drop_off_singular[lang]} \n {name}`)
  })(LANG);
  (function setBackgroudLayerOnInit(lang) {
    // disabling that for now since i think we want the background to change between language changes
    //        if(localStorage && localStorage.getItem(localStorageLayersItemId)) {
    //            return
    //        }
    if (lang === 'uk') {
      enableLayer(map, 'osmTilesUk');
      disableLayer(map, 'osmTiles');
    } else {
      enableLayer(map, 'osmTiles');
      disableLayer(map, 'osmTilesUk');
    }
  })(LANG);
  document.getElementById('switchMode').addEventListener('click', () => toggleMode(map));
})

// saves showed geolocation in local storage
if (typeof localStorage !== 'undefined') {

  const saveCenter = (() => localStorage.setItem("center", JSON.stringify(map.getCenter())));
  const saveZoom = (() => localStorage.setItem("zoom", map.getZoom()));

  // map.on('dragstart', saveCenter);
  map.on('drag', saveCenter);
  // map.on('dragend', saveCenter);

  // map.on('zoomstart', saveZoom);
  map.on('zoom', saveZoom);
  // map.on('zoomend', saveZoom);
}
