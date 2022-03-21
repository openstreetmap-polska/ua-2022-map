#!/usr/bin/env python

import logging
from typing import Union, Dict
import requests
import json
import sys
from pathlib import Path
import re

from osm2geojson import json2geojson
# woj. zgodnie z kod ISO 3166-2
# województwo zachodniopomorskie	woj_ZP	3600104401
# województwo świętokrzyskie	    woj_SK	3600130914
# województwo lubelskie	            woj_LU	3600130919
# województwo mazowieckie	        woj_MZ	3600130935
# województwo podkarpackie	        woj_PK	3600130957
# województwo lubuskie	            woj_LB	3600130969
# województwo wielkopolskie	        woj_WP	3600130971
# województwo pomorskie	            woj_PM	3600130975
# województwo kujawsko-pomorskie	woj_KP	3600223407
# województwo warmińsko-mazurskie	woj_WN	3600223408
# województwo dolnośląskie	        woj_DS	3600224457
# województwo łódzkie	            woj_LD	3600224458
# województwo małopolskie	        woj_MA	3600224459
# województwo opolskie	            woj_OP	3600224460
# województwo podlaskie	            woj_PD	3600224461
# województwo śląskie	            woj_SL	3600224462

logging.basicConfig(format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__file__)
logger.setLevel(logging.INFO)

overpass_api_url = "https://lz4.overpass-api.de/api/interpreter"

overpass_query = """
    [out:json][timeout:1100];
    area(id:3600104401)->.woj_ZP; 
    area(id:3600130914)->.woj_SK; 
    area(id:3600130919)->.woj_LU; 
    area(id:3600130935)->.woj_MZ; 
    area(id:3600130957)->.woj_PK; 
    area(id:3600130969)->.woj_LB; 
    area(id:3600130971)->.woj_WP; 
    area(id:3600130975)->.woj_PM; 
    area(id:3600223407)->.woj_KP; 
    area(id:3600223408)->.woj_WN; 
    area(id:3600224457)->.woj_DS; 
    area(id:3600224458)->.woj_LD; 
    area(id:3600224459)->.woj_MA; 
    area(id:3600224460)->.woj_OP; 
    area(id:3600224461)->.woj_PD; 
    area(id:3600224462)->.woj_SL; 
    area(id:3600049715)->.pol;
    area(id:3600014296)->.slov;
    area(id:3600090689)->.rom;
    area(id:3600186382)->.bul;
    area(id:3600058974)->.mol;
    area(id:3600021335)->.hun; 

    (
    nwr[social_facility~"food_bank|soup_kitchen|outreach"](area.pol);
    nwr[social_facility~"food_bank|soup_kitchen|outreach"](area.slov);

    nwr["social_facility:for"~"refugee|refugees"](area.pol);
    nwr["social_facility:for"~"refugee|refugees"](area.slov);
    nwr["social_facility:for"~"refugee|refugees"](area.rom);
    nwr["social_facility:for"~"refugee|refugees"](area.bul);
        
    nwr[building=train_station](area.pol);

    nwr[amenity=bus_station](area.pol);

    nwr[amenity=pharmacy](area.pol);

    nwr[amenity=hospital](area.pol);

    nwr["office"="diplomatic"]["country"="UA"](34.741612,-13.5351,71.016960,38.320313);

    nwr["healthcare"="blood_donation"](area.pol);

    nwr["information:for"="refugee"](area.pol);
    nwr["information:for"="refugee"](area.rom);
    
    nwr[office=lawyer]["fee:conditional"="no_@_refugees"](area.pol);
    nwr[office=lawyer]["fee"="no"](area.pol);
    
    nwr[amenity=school](area.pol);
);
out center body qt;
"""


def query_overpass_api(
    query: str,
    api_url: str = overpass_api_url,
) -> dict:
    logger.info(f"Requesting data from Overpass API. [url={api_url}]")
    response = requests.post(url=api_url, data={"data": query})
    response.raise_for_status()
    logger.info("Downloaded data from Overpass API.")
    return response.json()


def save_json(file_path: Union[str, Path], data: dict) -> None:
    logger.info(f"Saving .json file. [path={file_path}]")
    with open(file=file_path, mode="w", encoding="utf-8") as f:
        json.dump(data, f, allow_nan=False, separators=(",", ":"))
    logger.info("Done saving json file.")


def coalesce(*args) -> str:
    for arg in args:
        if arg:
            return arg
    return ""


def concatenate_tags(*tags, separator: str = ";") -> str:
    non_none_tags = list(filter(None, tags))
    return separator.join(non_none_tags)


def keep_key(tag: str) -> bool:
    tags_to_ignore = (
        re.compile("^name.*"),
        re.compile("^source.*"),
        re.compile("^ref.*"),
        re.compile("^.*phone$"),
        re.compile("^addr:.*"),
        re.compile("^alt_name.*"),
        re.compile("^official_name.*"),
    )
    for pattern in tags_to_ignore:
        if pattern.match(tag):
            return False
    return True


def process_feature_properties(properties: dict) -> dict:

    p = properties["tags"]
    results = {key: tag for key, tag in p.items() if keep_key(key)}
    results["name"] = p.get("name", "")
    results["name:pl"] = coalesce(p.get("name:pl"), p.get("name"))
    results["name:uk"] = coalesce(p.get("name:uk"), p.get("name:ua"), p.get("name"))
    results["name:en"] = coalesce(p.get("name:en"), p.get("name"))
    results["name:ru"] = coalesce(p.get("name:ru"), p.get("name"))

    if p.get("addr:housenumber"):
        results["address"] = (
            coalesce(p.get("addr:city"), p.get("addr:place")) + " " +
            (p.get("addr:street", "") + " " if p.get("addr:street", "") else "") +
            p.get("addr:housenumber")
        )

    results["phone"] = concatenate_tags(p.get("phone"), p.get("contact:phone"), separator=";")

    return results


def process_geojson(data: dict) -> dict:
    return {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": process_feature_properties(feature["properties"]),
                "geometry": feature["geometry"],
            }
            for feature in data["features"]
        ]
    }


def split_geojson(geojson: dict) -> Dict[str, dict]:
    routers = {
        "reception_points": (
            lambda p:
                True if (
                    p.get("social_facility:for", "") in ("refugee", "refugees")
                ) else False
        ),
        "information_points": (
            lambda p:
                True if (
                    p.get("information:for", "") in ("refugee", "refugees")
                ) else False
        ),
        "blood_donation_points": (
            lambda p:
                True if (
                    p.get("healthcare", "") == "blood_donation"
                ) else False
        ),
        "social_facilities": (
            lambda p:
                True if (
                        p.get("social_facility", "") in ("food_bank", "soup_kitchen")
                ) else False
        ),
        "pharmacies": (
            lambda p:
                True if (
                        p.get("amenity", "") == "pharmacy"
                ) else False
        ),
        "hospitals": (
            lambda p:
                True if (
                        p.get("amenity", "") == "hospital"
                ) else False
        ),
        "consulates": (
            lambda p:
                True if (
                        p.get("office", "") == "diplomatic"
                        and
                        p.get("country", "") == "UA"
                ) else False
        ),
        "train_stations": (
            lambda p:
                True if (
                        p.get("building", "") == "train_station"
                ) else False
        ),
        "bus_stations": (
            lambda p:
            True if (
                    p.get("amenity", "") == "bus_station"
            ) else False
        ),
        "legal_advice": (
            lambda p:
            True if (
                    p.get("office", "") == "lawyer"
            ) else False
        ),
    }
    results = {}

    logger.info(f"Splitting geojson containing: {len(geojson['features'])} features.")
    for feature in geojson["features"]:
        for layer_name, test in routers.items():
            if test(feature["properties"]):
                if results.get(layer_name):
                    results[layer_name]["features"].append(feature)
                else:
                    results[layer_name] = {
                        "type": "FeatureCollection",
                        "features": [feature],
                    }

    logger.info(f"Results have {len(results.keys())} layers.")
    for layer, gj in results.items():
        logger.info(f"Layer: {layer} with: {len(gj['features'])} features.")

    return results


def main(output_dir: Union[str, Path]) -> None:
    data = query_overpass_api(overpass_query)
    geojson_data = json2geojson(data)
    processed_data = process_geojson(geojson_data)
    save_json(file_path=output_dir.joinpath('osm_data.geojson'), data=processed_data)
    layers = split_geojson(processed_data)
    for name, gj in layers.items():
        save_json(file_path=output_dir.joinpath(name + '.geojson'), data=gj)


if __name__ == "__main__":

    this_files_dir = Path(__file__).parent.resolve()
    output_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else this_files_dir

    if not output_dir.is_dir():
        logger.error(f'Given path: "{output_dir}" is not a directory.')
        sys.exit(1)  # exit with non-zero error code

    main(output_dir=output_dir)
