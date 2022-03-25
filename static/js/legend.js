import { layersColoursDict } from './constants.js';

export function legendFactory(layersArray, layersVisibilityState) {
  const legend = document.getElementById('legend__wrapper');
  const list = document.createElement('ul');
  list.classList.add('legend__list')

  function addTogglingListener() {
    list.addEventListener('click', e => {
      const target = e.target;
      if (target.tagName === 'INPUT') {
        const layerId = target.dataset.layerId
        toggleLayer(map, layerId);
      }
    })
  }

  function getLegendItem(id, displayName, visible) {
    const legendItem = document.createElement('li');
    legendItem.classList.add('legend__item');
    legendItem.innerHTML = `
          <input class="is-checkradio is-info" id="chkbx${id}" type="checkbox" ${visible ? 'checked' : ''} type="checkbox" data-layer-id=${id}>
          <label for="chkbx${id}"><span class="is-size-6">
              <div style="background-color: ${layersColoursDict[id]}; width: 15px; height: 15px; display: inline-block; border-radius: 50%;"></div>
              ${displayName}
          </span></label>`;
    return legendItem
  }

  function renderLegend(layers) {
    layers.forEach(layer => {
      const legendItem = getLegendItem(layer.id, layer.name, layersVisibilityState[layer.id])
      list.appendChild(legendItem)
    })
    legend.appendChild(list)
  }

  addTogglingListener();
  renderLegend(layersArray);
}