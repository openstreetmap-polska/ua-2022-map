#!/usr/bin/env python
import app

if __name__ == '__main__':
    app.App.jinja_env.auto_reload = True
    app.App.config['TEMPLATES_AUTO_RELOAD'] = True
    app.App.run(debug=True)
