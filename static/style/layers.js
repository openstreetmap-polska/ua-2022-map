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
      "osmTilesUk": {
        "type": "raster",
        "tiles": [
          "https://dopomoha.pl/hot/{z}/{x}/{y}.png"
        ],
        "tileSize": 256,
        "maxzoom": 19,
        "paint": {"raster-fade-duration": 100},
        "attribution": "data © <a target=\"_top\" rel=\"noopener\" href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors."
      },
      "bloodDonationPoints": {
        "type": "geojson",
        "data": "https://dopomoha.pl/data/blood_donation_points.geojson",
        "cluster": false
      },
      "busStations": {
        "type": "geojson",
        "data": "https://dopomoha.pl/data/bus_stations.geojson",
        "cluster": true
      },
      "consulates": {
        "type": "geojson",
        "data": "https://dopomoha.pl/data/consulates.geojson",
        "cluster": true
      },
      "hospitals": {
        "type": "geojson",
        "data": "https://dopomoha.pl/data/hospitals.geojson",
        "cluster": true
      },
      "informationPoints": {
        "type": "geojson",
        "data": "https://dopomoha.pl/data/information_points.geojson",
        "cluster": true
      },
      "pharmacies": {
        "type": "geojson",
        "data": "https://dopomoha.pl/data/pharmacies.geojson",
        "cluster": true
      },
      "receptionPoints": {
        "type": "geojson",
        "data": "https://dopomoha.pl/data/reception_points.geojson",
        "cluster": true
      },
      "socialFacilities": {
        "type": "geojson",
        "data": "https://dopomoha.pl/data/social_facilities.geojson",
        "cluster": true
      },
      "trainStations": {
        "type": "geojson",
        "data": "https://dopomoha.pl/data/train_stations.geojson",
        "cluster": true
      },
      "charityDropOff": {
        "type": "geojson",
        "data": "https://dopomoha.pl/data/zbiorki.geojson",
        "cluster": true
      }
    },
    "sprite": "https://dopomoha.pl/static/style/sprite",
    "glyphs": "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
    "layers": [
    {
        "id": "osmTiles",
        "type": "raster",
        "metadata": {
            "group": "osmTiles",
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
        "id": "osmTilesUk",
        "type": "raster",
        "metadata": {
            "group": "osmTilesUk",
            "name": {
                "pl": "OSM Carto - język ukraiński",
                "en": "OSM Carto - ukrainian language",
                "uk": "OSM Carto - українська мова"
            }
        },
        "source": "osmTilesUk",
        "layout": {
            "visibility": "none"
        }
      },
      {
          "id": "helpPointsClusters",
          "type": "circle",
          "metadata": {
              "group": "helpPoints",
              "name": {
                  "pl": "Punkty recepcyjne",
                  "en": "Reception points",
                  "uk": "Прийомні пункти"
              }
          },
          "source": "receptionPoints",
          "filter": ["has", "point_count"],
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
          "id": "helpPointsSymbols",
          "type": "symbol",
          "metadata": {
              "group": "helpPoints",
              "name": {
                  "pl": "Punkty recepcyjne",
                  "en": "Reception points",
                  "uk": "Прийомні пункти"
              }
          },
          "source": "receptionPoints",
          "minzoom": 5,
          "filter": ["!", ["has", "point_count"]],
          "layout": {
              "text-field": "{name}",
              "text-offset": [0, 3],
              "text-size": 10,
              "text-font": ["Open Sans Bold"],
              "text-letter-spacing": 0.05,
              "text-allow-overlap": false,
              "icon-image": "amenity_social_facility",
              "icon-size": 1,
              "visibility": "visible"
          },
          "paint": {
              "text-color": "#050505",
              "text-halo-color": "rgba(255, 255, 255, 0.9)",
              "text-halo-width": 2
          }
      },
      {
          "id": "informationPointsClusters",
          "type": "circle",
          "metadata": {
              "group": "informationPoints",
              "name": {
                  "pl": "Punkty informacyjne",
                  "en": "Information points",
                  "uk": "Інформаційні пункти"
              }
          },
          "source": "informationPoints",
          "filter": ["has", "point_count"],
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
          "id": "informationPointsSymbols",
          "type": "symbol",
          "metadata": {
              "group": "informationPoints",
              "name": {
                  "pl": "Punkty informacyjne",
                  "en": "Information points",
                  "uk": "Інформаційні пункти"
              }
          },
          "source": "informationPoints",
          "minzoom": 5,
          "filter": ["!", ["has", "point_count"]],
          "layout": {
              "text-field": "{name}",
              "text-offset": [
                  0,
                  3
              ],
              "text-size": 10,
              "text-font": [
                  "Open Sans Bold"
              ],
              "text-letter-spacing": 0.05,
              "text-allow-overlap": false,
              "icon-image": "place-4",
              "icon-size": 1,
              "visibility": "visible"
          },
          "paint": {
              "text-color": "#050505",
              "text-halo-color": "rgba(255, 255, 255, 0.9)",
              "text-halo-width": 2
          }
      },
      {
          "id": "bloodDonationClusters",
          "type": "circle",
          "metadata": {
              "group": "bloodDonation",
              "name": {
                  "pl": "Punkty oddawania krwi",
                  "en": "Blood donation points",
                  "uk": "Пункти здачі крові"
              }
          },
          "source": "bloodDonationPoints",
          "filter": ["has", "point_count"],
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
          "id": "bloodDonationSymbols",
          "type": "symbol",
          "metadata": {
              "group": "bloodDonation",
              "name": {
                  "pl": "Punkty oddawania krwi",
                  "en": "Blood donation points",
                  "uk": "Пункти здачі крові"
              }
          },
          "source": "bloodDonationPoints",
          "minzoom": 5,
          "filter": ["!", ["has", "point_count"]],
          "layout": {
              "text-field": "{name}",
              "text-offset": [
                  0,
                  3
              ],
              "text-size": 7,
              "text-font": [
                  "Open Sans Bold"
              ],
              "text-letter-spacing": 0.05,
              "text-allow-overlap": false,
              "icon-image": "place-4",
              "icon-size": 1,
              "visibility": "none"
          },
          "paint": {
              "text-color": "#050505",
              "text-halo-color": "rgba(255, 255, 255, 0.9)",
              "text-halo-width": 2
          }
      },
      {
          "id": "socialFacilitiesClusters",
          "type": "circle",
          "metadata": {
              "group": "socialFacilities",
              "name": {
                  "pl": "Placówki opieki społecznej",
                  "en": "Social facilities",
                  "uk": "Установи соціальної опіки"
              }
          },
          "source": "socialFacilities",
          "filter": ["has", "point_count"],
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
          "id": "socialFacilitiesSymbols",
          "type": "symbol",
          "metadata": {
              "group": "socialFacilities",
              "name": {
                  "pl": "Placówki opieki społecznej",
                  "en": "Social facilities",
                  "uk": "Установи соціальної опіки"
              }
          },
          "source": "socialFacilities",
          "minzoom": 5,
          "filter": ["!", ["has", "point_count"]],
          "layout": {
              "text-field": "{name}",
              "text-offset": [
                  0,
                  3
              ],
              "text-size": 8,
              "text-font": [
                  "Open Sans Bold"
              ],
              "text-letter-spacing": 0.05,
              "text-allow-overlap": false,
              "icon-image": "place-4",
              "icon-size": 1,
              "visibility": "visible"
          },
          "paint": {
              "text-color": "#050505",
              "text-halo-color": "rgba(255, 255, 255, 0.9)",
              "text-halo-width": 2
          }
      },
      {
          "id": "pharmaciesClusters",
          "type": "circle",
          "metadata": {
              "group": "pharmacies",
              "name": {
                  "pl": "Apteki",
                  "en": "Pharmacies",
                  "uk": "Аптеки"
              }
          },
          "source": "pharmacies",
          "filter": ["has", "point_count"],
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
          "id": "pharmaciesSymbols",
          "type": "symbol",
          "metadata": {
              "group": "pharmacies",
              "name": {
                  "pl": "Apteki",
                  "en": "Pharmacies",
                  "uk": "Аптеки"
              }
          },
          "source": "pharmacies",
          "minzoom": 5,
          "filter": ["!", ["has", "point_count"]],
          "layout": {
              "text-field": "{name}",
              "text-offset": [
                  0,
                  3
              ],
              "text-size": 7,
              "text-font": [
                  "Open Sans Bold"
              ],
              "text-letter-spacing": 0.05,
              "text-allow-overlap": false,
              "icon-image": "place-4",
              "icon-size": 1,
              "visibility": "none"
          },
          "paint": {
              "text-color": "#050505",
              "text-halo-color": "rgba(255, 255, 255, 0.9)",
              "text-halo-width": 2
          }
      },
      {
          "id": "hospitalsClusters",
          "type": "circle",
          "metadata": {
              "group": "hospitals",
              "name": {
                  "pl": "Szpitale",
                  "en": "Hospitals",
                  "uk": "Лікарні"
              }
          },
          "source": "hospitals",
          "filter": ["has", "point_count"],
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
          "id": "hospitalsSymbols",
          "type": "symbol",
          "metadata": {
              "group": "hospitals",
              "name": {
                  "pl": "Szpitale",
                  "en": "Hospitals",
                  "uk": "Лікарні"
              }
          },
          "source": "hospitals",
          "minzoom": 5,
          "filter": ["!", ["has", "point_count"]],
          "layout": {
              "text-field": "{name}",
              "text-offset": [
                  0,
                  3
              ],
              "text-size": 8,
              "text-font": [
                  "Open Sans Bold"
              ],
              "text-letter-spacing": 0.05,
              "text-allow-overlap": false,
              "icon-image": "place-4",
              "icon-size": 1,
              "visibility": "none"
          },
          "paint": {
              "text-color": "#050505",
              "text-halo-color": "rgba(255, 255, 255, 0.9)",
              "text-halo-width": 2
          }
      },
      {
          "id": "diplomaticClusters",
          "type": "circle",
          "metadata": {
              "group": "diplomatic",
              "name": {
                  "pl": "Konsulaty",
                  "en": "Consulates",
                  "uk": "консульства"
              }
          },
          "source": "consulates",
          "filter": ["has", "point_count"],
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
          "id": "diplomaticSymbols",
          "type": "symbol",
          "metadata": {
              "group": "diplomatic",
              "name": {
                  "pl": "Konsulaty",
                  "en": "Consulates",
                  "uk": "консульства"
              }
          },
          "source": "consulates",
          "minzoom": 5,
          "filter": ["!", ["has", "point_count"]],
          "layout": {
              "text-field": "{name}",
              "text-offset": [
                  0,
                  3
              ],
              "text-size": 8,
              "text-font": [
                  "Open Sans Bold"
              ],
              "text-letter-spacing": 0.05,
              "text-allow-overlap": false,
              "icon-image": "place-4",
              "icon-size": 1,
              "visibility": "visible"
          },
          "paint": {
              "text-color": "#050505",
              "text-halo-color": "rgba(255, 255, 255, 0.9)",
              "text-halo-width": 2
          }
      },
      {
          "id": "charityDropOffClusters",
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
          "filter": ["has", "point_count"],
          "layout": {
              "visibility": "none"
          },
          "paint": {
              "circle-color": "#11ee11",
              "circle-radius": 7,
              "circle-stroke-color": "#fff",
              "circle-stroke-width": 2
          }
      },
      {
          "id": "charityDropOffSymbols",
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
          "filter": ["!", ["has", "point_count"]],
          "minzoom": 5,
          "layout": {
              "text-field": "Punkt zbiórki charytatywnej \n {name}",
              "text-offset": [
                  0,
                  3.5
              ],
              "text-size": 8,
              "text-font": [
                  "Open Sans Bold"
              ],
              "text-letter-spacing": 0.05,
              "text-allow-overlap": false,
              "icon-image": "place-4",
              "icon-size": 1,
              "visibility": "none"
          },
          "paint": {
              "text-color": "#050505",
              "text-halo-color": "rgba(255, 255, 255, 0.9)",
              "text-halo-width": 2
          }
      }
    ],
    "id": "dopomoha"
}
