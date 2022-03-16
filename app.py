import os
import json
import flask
import ruamel.yaml
from flask_minify import Minify

languages = ("pl", "uk", "en")

yaml = ruamel.yaml.YAML()
strings = yaml.load(
    open("strings.yaml", mode="r", encoding="utf-8").read()
)

App = flask.Flask(__name__)
Minify(app=App, html=True, js=True, cssless=True)

@App.route('/')
def get_index():
    return ''


@App.route('/<lang>/index.html')
@App.route('/<lang>/')
def get_language_index(lang):
    return flask.render_template('index.html', strings=strings, lang=lang)



@App.route('/<lang>/map.js')
def get_language_mapjs(lang):
    return (
        flask.render_template('map.js', strings=strings, lang=lang),
        {'Content-Type': 'application/javascript'},
    )


@App.route('/data/osm_data.geojson')
def get_osm_data_geojson():
    if not os.path.exists("osm_data.geojson"):
        return (
            '{"type": "FeatureCollection", "features": []}',
            {'Content-Type': 'application/octet-stream'},
        )
    with open("osm_data.geojson") as file:
        return (
            file.read(),
            {'Content-Type': 'application/octet-stream'},
        )
