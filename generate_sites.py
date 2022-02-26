import logging
import shutil
import json
import os
import sys
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape
from ruamel.yaml import YAML

this_file_dir = Path(__file__).parent.resolve()

logging.basicConfig(format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__file__)
logger.setLevel(logging.INFO)

env = Environment(
    loader=FileSystemLoader("templates"),
    autoescape=select_autoescape()
)

languages = ("pl", "uk", "en")

yaml = YAML()
strings = yaml.load(
    open(this_file_dir.joinpath("strings.yaml"), mode="r", encoding="utf-8").read()
)


def render_and_save(output_directory: Path, language: str) -> None:
    with open(this_file_dir.joinpath("static", "custom.geojson").resolve()) as file:
        points = json.load(file)['features']
    for template_name in env.list_templates():
        template = env.get_template(template_name)
        if template_name == 'point.html':
            for point in points:
                rendered = template.render(lang=language, strings=strings, point=point)
                path = output_directory.joinpath('points', f"{point['id']}.html")
                os.makedirs(os.path.dirname(path), exist_ok=True)
                with open(path, mode="w", encoding="utf-8") as out_file:
                    out_file.write(rendered)
        else:
            rendered = template.render(lang=language, strings=strings)
            with open(output_directory.joinpath(template_name), mode="w", encoding="utf-8") as out_file:
                out_file.write(rendered)


if __name__ == "__main__":

    default_dir = this_file_dir.joinpath("build").resolve()
    output_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else default_dir
    output_dir.mkdir(exist_ok=True)
    static_dir = this_file_dir.joinpath("static").resolve()

    # clean up output dir
    shutil.rmtree(output_dir.joinpath("static"), ignore_errors=True)

    # generate templates in all languages
    for lang in languages:
        lang_dir = output_dir.joinpath(lang)
        shutil.rmtree(lang_dir, ignore_errors=True)
        lang_dir.mkdir(exist_ok=True)
        render_and_save(output_directory=lang_dir, language=lang)

    # copy static files
    shutil.copytree(
        src=static_dir,
        dst=output_dir.joinpath("static"),
    )
