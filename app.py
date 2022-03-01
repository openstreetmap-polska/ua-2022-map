import os
import json
import flask
import ruamel.yaml

languages = ("pl", "uk", "en")

yaml = ruamel.yaml.YAML()
strings = yaml.load(
    open("strings.yaml", mode="r", encoding="utf-8").read()
)

App = flask.Flask(__name__)


@App.route('/')
def get_index():
    return '''<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8" />
            <title></title>
            <meta http-equiv="Refresh" content="0; url='/uk/#map=7/50.538/24.055'" />
        </head>
        <body>

        </body>
        </html>
    '''


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
