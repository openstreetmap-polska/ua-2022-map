import app
import flask_frozen


if __name__ == "__main__":
    flask_frozen.Freezer(app.App).freeze()
