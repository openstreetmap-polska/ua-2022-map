#!/usr/bin/env python

import argparse

import app

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--host', type=str, default='127.0.0.1')
    parser.add_argument('--port', type=int, default=8000)

    args = parser.parse_args()

    app.App.jinja_env.auto_reload = True
    app.App.config['TEMPLATES_AUTO_RELOAD'] = True
    app.App.run(debug=True, host=args.host, port=args.port)
