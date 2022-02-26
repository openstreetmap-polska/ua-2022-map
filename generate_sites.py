import app
import flask
import flask_frozen


@app.App.before_first_request
def add_frozen_url_hints():
    ''' Let Frozen-Flask know what entry point URLs should be generated.
    '''
    for lang in app.languages:
        flask.url_for('get_language_index', lang=lang)


if __name__ == "__main__":
    flask_frozen.Freezer(app.App).freeze()
