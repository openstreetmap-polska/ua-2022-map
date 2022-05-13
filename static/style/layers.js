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
      "bloodDonationPoints": {
        "type": "geojson",
        "data": "https://dopomoha.pl/data/blood_donation_points.geojson",
        "cluster": false
      },
      "busStations": {
        "type": "geojson",
        "data": "https://dopomoha.pl/data/bus_stations.geojson",
        "cluster": false
      },
      "consulates": {
        "type": "geojson",
        "data": "https://dopomoha.pl/data/consulates.geojson",
        "cluster": false
      },
      "hospitals": {
        "type": "geojson",
        "data": "https://dopomoha.pl/data/hospitals.geojson",
        "cluster": false
      },
      "informationPoints": {
        "type": "geojson",
        "data": "https://dopomoha.pl/data/information_points.geojson",
        "cluster": false
      },
      "pharmacies": {
        "type": "geojson",
        "data": "https://dopomoha.pl/data/pharmacies.geojson",
        "cluster": true
      },
      "receptionPoints": {
        "type": "geojson",
        "data": "https://dopomoha.pl/data/reception_points.geojson",
        "cluster": false
      },
      "socialFacilities": {
        "type": "geojson",
        "data": "https://dopomoha.pl/data/social_facilities.geojson",
        "cluster": false
      },
      "trainStations": {
        "type": "geojson",
        "data": "https://dopomoha.pl/data/train_stations.geojson",
        "cluster": false
      },
      "governmentAdministrative": {
        "type": "geojson",
        "data": "https://dopomoha.pl/data/government_administrative.geojson",
        "cluster": false
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
        "source": "receptionPoints",
        "filter": ["!", ["has", "point_count"]],
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
        "minzoom": 5,
        "source": "receptionPoints",
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
        "source": "informationPoints",
        "filter": ["!", ["has", "point_count"]],
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
        "minzoom": 5,
        "source": "informationPoints",
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
        "source": "bloodDonationPoints",
        "filter": ["!", ["has", "point_count"]],
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
        "minzoom": 5,
        "source": "bloodDonationPoints",
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
        "source": "socialFacilities",
        "filter": ["!", ["has", "point_count"]],
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
        "minzoom": 5,
        "source": "socialFacilities",
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
            "circle-radius": 8,
            "circle-stroke-color": "#fff",
            "circle-stroke-width": 1
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
        "source": "pharmacies",
        "filter": ["!", ["has", "point_count"]],
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
        "minzoom": 5,
        "source": "pharmacies",
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
        "source": "hospitals",
        "filter": ["!", ["has", "point_count"]],
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
        "minzoom": 5,
        "source": "hospitals",
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
        "source": "consulates",
        "filter": ["!", ["has", "point_count"]],
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
        "minzoom": 5,
        "source": "consulates",
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
            "visibility": "visible"
        },
        "paint": {
            "text-color": "#050505",
            "text-halo-color": "rgba(255, 255, 255, 0.9)",
            "text-halo-width": 2
        }
    },
    {
        "id": "governmentAdministrativeCircles",
        "type": "circle",
        "metadata": {
            "group": "governmentAdministrative",
            "name": {
                "pl": "Urzędy",
                "en": "Government Offices",
                "uk": "Урядові установи"
            }
        },
        "source": "governmentAdministrative",
        "filter": ["!", ["has", "point_count"]],
        "layout": {
            "visibility": "visible"
        },
        "paint": {
            "circle-color": "#111111",
            "circle-radius": 10,
            "circle-stroke-color": "#fff",
            "circle-stroke-width": 2
        }
    },
    {
        "id": "governmentAdministrativeLabels",
        "type": "symbol",
        "metadata": {
            "group": "governmentAdministrative",
            "name": {
                "pl": "Urzędy",
                "en": "Government Offices",
                "uk": "Урядові установи"
            }
        },
        "minzoom": 5,
        "source": "governmentAdministrative",
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
            "circle-radius": 10,
            "circle-stroke-color": "#fff",
            "circle-stroke-width": 2
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
        "filter": ["!", ["has", "point_count"]],
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
        "minzoom": 5,
        "source": "charityDropOff",
        "filter": ["!", ["has", "point_count"]],
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
            "visibility": "none"
        },
        "paint": {
            "text-color": "#050505",
            "text-halo-color": "rgba(255, 255, 255, 0.9)",
            "text-halo-width": 2
        }
    }
    ],
    "id": "styl_dopomoha"
}