import logging
import shutil
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

languages = ("pl", "ua", "en")

yaml = YAML()
strings = yaml.load(
    open(this_file_dir.joinpath("data", "strings.yaml"), mode="r", encoding="utf-8").read()
)


def render_and_save(output_directory: Path, language: str) -> None:
    for template_name in env.list_templates():
        template = env.get_template(template_name)
        rendered = template.render(lang=language, strings=strings)
        with open(output_directory.joinpath(template_name), mode="w", encoding="utf-8") as out_file:
            out_file.write(rendered)


if __name__ == "__main__":

    default_dir = this_file_dir.joinpath("build").resolve()
    output_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else default_dir
    output_dir.mkdir(exist_ok=True)

    if not output_dir.is_dir():
        logger.error(f"Given path: {output_dir} is not a directory.")
        sys.exit()

    for lang in languages:
        lang_dir = output_dir.joinpath(lang)
        lang_dir.mkdir(exist_ok=True)
        render_and_save(output_directory=lang_dir, language=lang)

    shutil.copy(
        src=this_file_dir.joinpath("data", "custom.geojson").resolve(),
        dst=this_file_dir.joinpath("build", "custom.geojson").resolve(),
    )
    shutil.copy(
        src=this_file_dir.joinpath("data", "style.css").resolve(),
        dst=this_file_dir.joinpath("build", "style.css").resolve(),
    )
