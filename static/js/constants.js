export const controlsLocation = 'bottom-right';

export const layersColoursDict = {
  helpPoints: '#ffd500',
  informationPoints: '#ffee00',
  bloodDonation: '#990000',
  socialFacilities: '#00d5ff',
  pharmacies: '#880044',
  hospitals: '#ff1111',
  diplomatic: '#446688',
  governmentAdministrative: "#111111",
  charityDropOff: '#11ee11',
}

export const modesSettings = {
  'forUkrainian': {
    'layersToDisable': ['charityDropOff', 'bloodDonation'],
    'layersToEnable': ['helpPoints', 'informationPoints', 'socialFacilities', 'diplomatic'],
  },
  'forPole': {
    'layersToDisable': ['helpPoints', 'informationPoints', 'socialFacilities'],
    'layersToEnable': ['charityDropOff', 'diplomatic', 'bloodDonation'],
  },
}

// change this with updates to layer visibility in style to reset settings set by users locally
export const localStorageLayersItemId = 'layers-v2';
export const sidebarDivId = 'sidebar-div';

