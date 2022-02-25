import logging
from typing import Union
import requests
import json
import sys
from pathlib import Path

from osm2geojson import json2geojson

logging.basicConfig(format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__file__)
logger.setLevel(logging.INFO)

overpass_api_url = "https://lz4.overpass-api.de/api/interpreter"

overpass_query = """

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


def main(output_path: Union[str, Path]) -> None:
    data = query_overpass_api(overpass_query)
    geojson_data = json2geojson(data)
    save_json(output_path, geojson_data)


if __name__ == "__main__":

    this_files_dir = Path(__file__).parent.resolve()
    output_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else this_files_dir
    fp = output_dir.joinpath('osm_data.geojson')

    if not output_dir.is_dir():
        logger.error(f'Given path: "f{output_dir}" is not a directory.')
        sys.exit()

    main(output_path=fp)
