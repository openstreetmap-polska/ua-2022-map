"""
Helper file that takes static/style/layers.js and makes it into a JSON.
This will make it easier to load style to Maputnik editor.
"""

import json
import logging
import sys
from pathlib import Path
from typing import Union

logging.basicConfig(format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__file__)
logger.setLevel(logging.INFO)


def save_json(file_path: Union[str, Path], data: dict) -> None:
    logger.info(f"Saving .json file. [path={file_path}]")
    with open(file=file_path, mode="w", encoding="utf-8") as f:
        json.dump(data, f, allow_nan=False, separators=(",", ":"))
    logger.info("Done saving json file.")


def main(wd: Path) -> None:
    js_file_path = wd.joinpath('layers.js')
    if not js_file_path.is_file():
        logger.error(f'Given path: "{js_file_path}" is not a file.')
        sys.exit(1)  # exit with non-zero error code
    # remove string "export default " the rest is valid json
    style = open(js_file_path, 'r', encoding='utf-8').read()[15:]
    try:
        style_json = json.loads(style)
    except json.JSONDecodeError as e:
        logger.error(f'There was a problem parsing json style: {e}', exc_info=True)
        raise
    json_file_path = wd.joinpath('layers.json')
    save_json(file_path=json_file_path, data=style_json)


if __name__ == "__main__":

    this_files_dir = Path(__file__).parent.joinpath('static/style/').resolve()
    work_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else this_files_dir

    if not work_dir.is_dir():
        logger.error(f'Given path: "{work_dir}" is not a directory.')
        sys.exit(1)  # exit with non-zero error code

    main(wd=work_dir)
