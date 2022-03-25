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
    return ''

@App.route('/<lang>/index.html')
@App.route('/<lang>/')
def get_language_index(lang):
    return flask.render_template('index.html', strings=strings, lang=lang)
