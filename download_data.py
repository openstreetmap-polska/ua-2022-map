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
[out:json][timeout:360];
area(id:3600130919)->.wojLub;
area(id:3600130957)->.wojPodk;
area(id:3600049715)->.pol;
area(id:3600060199)->.ukra;
area(id:3600072380)->.ukra1;
area(id:3600071064)->.ukra2;
(
  nwr[social_facility~"shelter|outreach|food_bank|soup_kitchen"](area.wojLub); 
  nwr[social_facility~"shelter|outreach|food_bank|soup_kitchen"](area.wojPodk);
  nwr[social_facility~"shelter|outreach|food_bank|soup_kitchen"](area.ukra1);
  nwr[social_facility~"shelter|outreach|food_bank|soup_kitchen"](area.ukra2);

  nwr[building=train_station](area.wojLub);
  nwr[building=train_station](area.wojPodk);

  nwr[amenity=bus_station](area.wojLub);
  nwr[amenity=bus_station](area.wojPodk);

  nwr[amenity=pharmacy](area.wojLub);
  nwr[amenity=pharmacy](area.wojPodk);
  nwr[amenity=pharmacy](area.ukra1);
  nwr[amenity=pharmacy](area.ukra2);

  nwr[amenity=hospital](area.wojLub);
  nwr[amenity=hospital](area.wojPodk);
  nwr[amenity=hospital](area.ukra1);
  nwr[amenity=hospital](area.ukra2);

  nwr["office"="diplomatic"]["country"="UA"](area.pol);
  nwr["office"="diplomatic"]["country"="UA"](area.ukra);

  nwr["healthcare"="blood_donation"](area.pol);
  nwr["healthcare"="blood_donation"](area.ukra);

  nwr["information:for"="refugees"](area.pol);
  nwr["information:for"="refugees"](area.ukra);
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


def keep_tag(tag: str) -> bool:
    tags_to_ignore = (
        re.compile("^name.*"),
        re.compile("^source$"),
        re.compile("^ref.*"),
    )
    for pattern in tags_to_ignore:
        if pattern.match(tag):
            return False
    return True


def process_feature_properties(properties: dict) -> dict:

    p = properties["tags"]
    results = {k: v for k, v in p.items() if keep_tag(k)}
    results["name:pl"] = coalesce(p.get("name:pl"), p.get("name"))
    results["name:uk"] = coalesce(p.get("name:uk"), p.get("name:ua"), p.get("name"))
    results["name:en"] = coalesce(p.get("name:en"), p.get("name"))

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
