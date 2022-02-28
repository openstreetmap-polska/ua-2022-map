export default {
    "version": 8,
    "metadata": {"maputnik:renderer": "mbgljs"},
    "sources": {
      "osmTiles": {
        "type": "raster",
        "tiles": [
          "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
        ],
        "tileSize": 256,
        "maxzoom": 19,
        "paint": {"raster-fade-duration": 100},
        "attribution": "data © <a target=\"_top\" rel=\"noopener\" href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors."
      },
      "mediaWikiTiles": {
        "type": "raster",
        "tiles": ["https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang=uk"],
        "tileSize": 256,
        "maxzoom": 19,
        "paint": {"raster-fade-duration": 100},
        "attribution": "map: <a target=\"_top\" rel=\"noopener\" href=\"https://foundation.wikimedia.org/wiki/Maps_Terms_of_Use\">WikiMedia</a>; data: © <a target=\"_top\" rel=\"noopener\" href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors."
      },
      "custom": {
        "type": "geojson",
        "data": "../static/custom.geojson",
        "maxzoom": 12,
        "generateId": true
      },
      "osmData": {
        "type": "geojson",
        "data": "../data/osm_data.geojson",
        "maxzoom": 12
      },
      "charityDropOff": {
        "type": "geojson",
        "data": "https://dopomoha.pl/data/zbiorki.geojson",
        "maxzoom": 12
      }
    },
    "glyphs": "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
    "layers": [
      {
        "id": "background",
        "type": "raster",
        "metadata": {
            "group": "background",
            "name": {
                "pl": "OSM Carto",
                "en": "OSM Carto",
                "uk": "OSM Carto"
            }
        },
        "source": "osmTiles",
        "layout": {
            "visibility": "visible"
        }
      },
      {
          "id": "helpPointsCircles",
          "type": "circle",
          "metadata": {
              "group": "helpPoints",
              "name": {
                  "pl": "Punkty recepcyjne",
                  "en": "Reception points",
                  "uk": "Прийомні пункти"
              }
          },
          "source": "osmData",
          "filter": [
              "all",
              [
                  "==",
                  [
                      "get",
                      "social_facility"
                  ],
                  "outreach"
              ],
              [
                  "==",
                  [
                      "get",
                      "social_facility:for"
                  ],
                  "refugee"
              ]
          ],
          "layout": {
              "visibility": "visible"
          },
          "paint": {
              "circle-color": "#ffd500",
              "circle-radius": 12,
              "circle-stroke-color": "#fff",
              "circle-stroke-width": 3
          }
      },
      {
          "id": "helpPointsLabels",
          "type": "symbol",
          "metadata": {
              "group": "helpPoints",
              "name": {
                  "pl": "Punkty recepcyjne",
                  "en": "Reception points",
                  "uk": "Прийомні пункти"
              }
          },
          "source": "osmData",
          "minzoom": 5,
          "filter": [
              "all",
              [
                  "==",
                  [
                      "get",
                      "social_facility"
                  ],
                  "outreach"
              ],
              [
                  "==",
                  [
                      "get",
                      "social_facility:for"
                  ],
                  "refugee"
              ]
          ],
          "layout": {
              "text-field": "{name:pl}",
              "text-offset": [
                  0,
                  3
              ],
              "text-size": 10,
              "text-font": [
                  "Open Sans Bold"
              ],
              "text-letter-spacing": 0.05,
              "visibility": "visible"
          },
          "paint": {
              "text-color": "#050505",
              "text-halo-color": "rgba(255, 255, 255, 0.9)",
              "text-halo-width": 2
          }
      },
      {
          "id": "informationPointsCircles",
          "type": "circle",
          "metadata": {
              "group": "informationPoints",
              "name": {
                  "pl": "Punkty informacyjne",
                  "en": "Information points",
                  "uk": "Інформаційні пункти"
              }
          },
          "source": "osmData",
          "filter": [
              "==",
              [
                  "get",
                  "information:for"
              ],
              "refugees"
          ],
          "layout": {
              "visibility": "visible"
          },
          "paint": {
              "circle-color": "#ffee00",
              "circle-radius": 9,
              "circle-stroke-color": "#fff",
              "circle-stroke-width": 2
          }
      },
      {
          "id": "informationPointsLabels",
          "type": "symbol",
          "metadata": {
              "group": "informationPoints",
              "name": {
                  "pl": "Punkty informacyjne",
                  "en": "Information points",
                  "uk": "Інформаційні пункти"
              }
          },
          "source": "osmData",
          "minzoom": 5,
          "filter": [
              "==",
              [
                  "get",
                  "information:for"
              ],
              "refugees"
          ],
          "layout": {
              "text-field": "{name:pl}",
              "text-offset": [
                  0,
                  3
              ],
              "text-size": 10,
              "text-font": [
                  "Open Sans Bold"
              ],
              "text-letter-spacing": 0.05,
              "visibility": "visible"
          },
          "paint": {
              "text-color": "#050505",
              "text-halo-color": "rgba(255, 255, 255, 0.9)",
              "text-halo-width": 2
          }
      },
      {
          "id": "bloodDonationCircles",
          "type": "circle",
          "metadata": {
              "group": "bloodDonation",
              "name": {
                  "pl": "Punkty oddawania krwi",
                  "en": "Blood donation points",
                  "uk": "Пункти здачі крові"
              }
          },
          "source": "osmData",
          "filter": [
              "==",
              [
                  "get",
                  "healthcare"
              ],
              "blood_donation"
          ],
          "layout": {
              "visibility": "none"
          },
          "paint": {
              "circle-color": "#990000",
              "circle-radius": 6,
              "circle-stroke-color": "#fff",
              "circle-stroke-width": 2
          }
      },
      {
          "id": "bloodDonationLabels",
          "type": "symbol",
          "metadata": {
              "group": "bloodDonation",
              "name": {
                  "pl": "Punkty oddawania krwi",
                  "en": "Blood donation points",
                  "uk": "Пункти здачі крові"
              }
          },
          "source": "osmData",
          "minzoom": 5,
          "filter": [
              "==",
              [
                  "get",
                  "healthcare"
              ],
              "blood_donation"
          ],
          "layout": {
              "text-field": "{name:pl}",
              "text-offset": [
                  0,
                  3
              ],
              "text-size": 7,
              "text-font": [
                  "Open Sans Bold"
              ],
              "text-letter-spacing": 0.05,
              "visibility": "none"
          },
          "paint": {
              "text-color": "#050505",
              "text-halo-color": "rgba(255, 255, 255, 0.9)",
              "text-halo-width": 2
          }
      },
      {
          "id": "socialFacilitiesCircles",
          "type": "circle",
          "metadata": {
              "group": "socialFacilities",
              "name": {
                  "pl": "Placówki opieki społecznej",
                  "en": "Social facilities",
                  "uk": "Установи соціальної опіки"
              }
          },
          "source": "osmData",
          "filter": [
              "any",
              [
                  "in",
                  [
                      "get",
                      "social_facility"
                  ],
                  [
                      "literal",
                      [
                          "shelter",
                          "food_bank",
                          "soup_kitchen"
                      ]
                  ]
              ],
              [
                  "==",
                  [
                      "get",
                      "social_facility:for"
                  ],
                  "refugees"
              ]
          ],
          "layout": {
              "visibility": "visible"
          },
          "paint": {
              "circle-color": "#00d5ff",
              "circle-radius": 7,
              "circle-stroke-color": "#fff",
              "circle-stroke-width": 2
          }
      },
      {
          "id": "socialFacilitiesLabels",
          "type": "symbol",
          "metadata": {
              "group": "socialFacilities",
              "name": {
                  "pl": "Placówki opieki społecznej",
                  "en": "Social facilities",
                  "uk": "Установи соціальної опіки"
              }
          },
          "source": "osmData",
          "minzoom": 5,
          "filter": [
              "any",
              [
                  "in",
                  [
                      "get",
                      "social_facility"
                  ],
                  [
                      "literal",
                      [
                          "shelter",
                          "food_bank",
                          "soup_kitchen"
                      ]
                  ]
              ],
              [
                  "==",
                  [
                      "get",
                      "social_facility:for"
                  ],
                  "refugees"
              ]
          ],
          "layout": {
              "text-field": "{name:pl}",
              "text-offset": [
                  0,
                  3
              ],
              "text-size": 8,
              "text-font": [
                  "Open Sans Bold"
              ],
              "text-letter-spacing": 0.05,
              "visibility": "visible"
          },
          "paint": {
              "text-color": "#050505",
              "text-halo-color": "rgba(255, 255, 255, 0.9)",
              "text-halo-width": 2
          }
      },
      {
          "id": "pharmaciesCircles",
          "type": "circle",
          "metadata": {
              "group": "pharmacies",
              "name": {
                  "pl": "Apteki",
                  "en": "Pharmacies",
                  "uk": "Аптеки"
              }
          },
          "source": "osmData",
          "filter": [
              "==",
              [
                  "get",
                  "amenity"
              ],
              "pharmacy"
          ],
          "layout": {
              "visibility": "none"
          },
          "paint": {
              "circle-color": "#880044",
              "circle-radius": 5,
              "circle-stroke-color": "#fff",
              "circle-stroke-width": 1
          }
      },
      {
          "id": "pharmaciesLabels",
          "type": "symbol",
          "metadata": {
              "group": "pharmacies",
              "name": {
                  "pl": "Apteki",
                  "en": "Pharmacies",
                  "uk": "Аптеки"
              }
          },
          "source": "osmData",
          "minzoom": 5,
          "filter": [
              "==",
              [
                  "get",
                  "amenity"
              ],
              "pharmacy"
          ],
          "layout": {
              "text-field": "{name:pl}",
              "text-offset": [
                  0,
                  3
              ],
              "text-size": 7,
              "text-font": [
                  "Open Sans Bold"
              ],
              "text-letter-spacing": 0.05,
              "visibility": "none"
          },
          "paint": {
              "text-color": "#050505",
              "text-halo-color": "rgba(255, 255, 255, 0.9)",
              "text-halo-width": 2
          }
      },
      {
          "id": "hospitalsCircles",
          "type": "circle",
          "metadata": {
              "group": "hospitals",
              "name": {
                  "pl": "Szpitale",
                  "en": "Hospitals",
                  "uk": "Лікарні"
              }
          },
          "source": "osmData",
          "filter": [
              "==",
              [
                  "get",
                  "amenity"
              ],
              "hospital"
          ],
          "layout": {
              "visibility": "none"
          },
          "paint": {
              "circle-color": "#ff1111",
              "circle-radius": 8,
              "circle-stroke-color": "#fff",
              "circle-stroke-width": 2
          }
      },
      {
          "id": "hospitalsLabels",
          "type": "symbol",
          "metadata": {
              "group": "hospitals",
              "name": {
                  "pl": "Szpitale",
                  "en": "Hospitals",
                  "uk": "Лікарні"
              }
          },
          "source": "osmData",
          "minzoom": 5,
          "filter": [
              "==",
              [
                  "get",
                  "amenity"
              ],
              "hospital"
          ],
          "layout": {
              "text-field": "{name:pl}",
              "text-offset": [
                  0,
                  3
              ],
              "text-size": 8,
              "text-font": [
                  "Open Sans Bold"
              ],
              "text-letter-spacing": 0.05,
              "visibility": "none"
          },
          "paint": {
              "text-color": "#050505",
              "text-halo-color": "rgba(255, 255, 255, 0.9)",
              "text-halo-width": 2
          }
      },
      {
          "id": "diplomaticCircles",
          "type": "circle",
          "metadata": {
              "group": "diplomatic",
              "name": {
                  "pl": "Konsulaty",
                  "en": "Consulates",
                  "uk": "консульства"
              }
          },
          "source": "osmData",
          "filter": [
              "all",
              [
                  "==",
                  [
                      "get",
                      "office"
                  ],
                  "diplomatic"
              ],
              [
                  "==",
                  [
                      "get",
                      "country"
                  ],
                  "UA"
              ]
          ],
          "layout": {
              "visibility": "visible"
          },
          "paint": {
              "circle-color": "#446688",
              "circle-radius": 10,
              "circle-stroke-color": "#fff",
              "circle-stroke-width": 2
          }
      },
      {
          "id": "diplomaticLabels",
          "type": "symbol",
          "metadata": {
              "group": "diplomatic",
              "name": {
                  "pl": "Konsulaty",
                  "en": "Consulates",
                  "uk": "консульства"
              }
          },
          "source": "osmData",
          "minzoom": 5,
          "filter": [
              "all",
              [
                  "==",
                  [
                      "get",
                      "office"
                  ],
                  "diplomatic"
              ],
              [
                  "==",
                  [
                      "get",
                      "country"
                  ],
                  "UA"
              ]
          ],
          "layout": {
              "text-field": "{name:pl}",
              "text-offset": [
                  0,
                  3
              ],
              "text-size": 8,
              "text-font": [
                  "Open Sans Bold"
              ],
              "text-letter-spacing": 0.05,
              "visibility": "visible"
          },
          "paint": {
              "text-color": "#050505",
              "text-halo-color": "rgba(255, 255, 255, 0.9)",
              "text-halo-width": 2
          }
      },
      {
          "id": "charityDropOffCircles",
          "type": "circle",
          "metadata": {
              "group": "charityDropOff",
              "name": {
                  "pl": "Punkty zbiórek charytatywnych",
                  "en": "Donation drop points",
                  "uk": "Благодійні пункти збору"
              }
          },
          "source": "charityDropOff",
          "layout": {
              "visibility": "visible"
          },
          "paint": {
              "circle-color": "#11ee11",
              "circle-radius": 7,
              "circle-stroke-color": "#fff",
              "circle-stroke-width": 2
          }
      },
      {
          "id": "charityDropOffLabels",
          "type": "symbol",
          "metadata": {
              "group": "charityDropOff",
              "name": {
                  "pl": "Punkty zbiórek charytatywnych",
                  "en": "Donation drop points",
                  "uk": "Благодійні пункти збору"
              }
          },
          "source": "charityDropOff",
          "minzoom": 5,
          "layout": {
              "text-field": "Punkt zbiórki charytatywnej \n {Name}",
              "text-offset": [
                  0,
                  3.5
              ],
              "text-size": 8,
              "text-font": [
                  "Open Sans Bold"
              ],
              "text-letter-spacing": 0.05,
              "visibility": "visible"
          },
          "paint": {
              "text-color": "#050505",
              "text-halo-color": "rgba(255, 255, 255, 0.9)",
              "text-halo-width": 2
          }
      }
    ],
    "id": "53fam6b4c"
}