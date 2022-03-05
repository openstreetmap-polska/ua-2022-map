#!/usr/bin/env python

import logging
from typing import Union
import requests
import json
import sys
from pathlib import Path
import re

from osm2geojson import json2geojson

logging.basicConfig(format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__file__)
logger.setLevel(logging.INFO)

overpass_api_url = "https://lz4.overpass-api.de/api/interpreter"

overpass_query = """
    [out:json][timeout:420];
    area(id:3600130919)->.wojLub;
    area(id:3600130957)->.wojPodk;
    area(id:3600049715)->.pol;
    area(id:3600014296)->.slov;
    area(id:3600090689)->.rom;
    area(id:3600186382)->.bul;
    area(id:3600058974)->.mol;
    area(id:3600021335)->.hun; 

    (
    nwr[social_facility~"food_bank|soup_kitchen|outreach"](area.pol);
    nwr[social_facility~"food_bank|soup_kitchen|outreach"](area.slov);

    nwr["social_facility:for"~"refugee"](area.pol);
    nwr["social_facility:for"~"refugee"](area.slov);
    nwr["social_facility:for"~"refugee"](area.rom);
    nwr["social_facility:for"~"refugee"](area.bul);
        
    nwr[building=train_station](area.wojLub);
    nwr[building=train_station](area.wojPodk);

    nwr[amenity=bus_station](area.wojLub);
    nwr[amenity=bus_station](area.wojPodk);

    nwr[amenity=pharmacy](area.wojLub);
    nwr[amenity=pharmacy](area.wojPodk);

    nwr[amenity=hospital](area.wojLub);
    nwr[amenity=hospital](area.wojPodk);

    nwr["office"="diplomatic"]["country"="UA"](34.741612,-13.5351,71.016960,38.320313);

    nwr["healthcare"="blood_donation"](area.pol);

    nwr["information:for"="refugee"](area.pol);
    nwr["information:for"="refugee"](area.rom);
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
        re.compile("^source$"),
        re.compile("^ref.*"),
        re.compile("^.*phone$")
    )
    for pattern in tags_to_ignore:
        if pattern.match(tag):
            return False
    return True


def process_feature_properties(properties: dict) -> dict:

    p = properties["tags"]
    results = {key: tag for key, tag in p.items() if keep_key(key)}
    results["name:pl"] = coalesce(p.get("name:pl"), p.get("name"))
    results["name:uk"] = coalesce(p.get("name:uk"), p.get("name:ua"), p.get("name"))
    results["name:en"] = coalesce(p.get("name:en"), p.get("name"))

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


def main(output_path: Union[str, Path]) -> None:
    data = query_overpass_api(overpass_query)
    geojson_data = json2geojson(data)
    processed_data = process_geojson(geojson_data)
    save_json(output_path, processed_data)


if __name__ == "__main__":
    #print(sys.argv[1])

    this_files_dir = Path(__file__).parent.resolve()
    output_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else this_files_dir
    fp = output_dir.joinpath('osm_data.geojson')

    if not output_dir.is_dir():
        logger.error(f'Given path: "{output_dir}" is not a directory.')
        sys.exit(1) # exit with non-zero error code, see #3

    main(output_path=fp)
