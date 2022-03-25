import layers from '../style/layers.js'
import { localStorageLayersItemId } from './constants.js';

export const { layersDefinitions, layersVisibilityState } = getLayersState(layers.layers, LANG);
export const layersArray = Object.keys(layersDefinitions).map(id => layersDefinitions[id]);

function loadLayersVisibilitySave() {
  let state;
  if (typeof localStorage !== 'undefined') {

    state = localStorage.getItem(localStorageLayersItemId);
    if (state) try {

      state = JSON.parse(state);

    } catch (e) { console.warn(e) }
  }

  if (!state)
    return {};

  return state;
}

function getLayersState(layers, lang) {
  const definitions = {};
  const visibilities = loadLayersVisibilitySave();

  layers.forEach(layer => {

    const { group } = layer.metadata;
    const { visibility } = layer.layout;

    if (visibilities.hasOwnProperty(group)) {

      layer.layout.visibility = (visibilities[group] ? 'visible' : 'none');

    } else if (!definitions[group]) {
      // takes state from definitions when not present
      visibilities[group] = (visibility === 'visible');
    }

    if (definitions[group]) {

      definitions[group].layers.push(layer);

    } else {

      definitions[group] = {
        layers: [layer],
        id: group,
        name: layer.metadata.name[lang],
      }
    }
  });

  return {
    layersDefinitions: definitions,
    layersVisibilityState: visibilities
  };
}
