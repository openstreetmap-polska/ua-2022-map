# ua-2022-map
Map of reception points for refugees near Polish-Ukrainian border

work in progress...


# Development

We provide a docker-based dev environment; to spin up the system, run

```bash
make
make up
make down
```

For development and iterating on the code, get into a shell in the container and re-run your scripts from there with

```bash
make sh
```

From inside the shell you can then execute your scripts and iterate, e.g.
```
/app # ./download_data.py
/app # ./debug-app.py --host 0.0.0.0
```

If you prefer to run outside of docker instead, read on.

Steps:
1. Create Python virtual env
2. Install dependencies
3. Generate site from templates
4. Run local server

Repeat step 3 after changes.

Commands:
```bash
# clone the repo and enter the directory then:
python3 -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
./debug-app.py
```

Go to http://localhost:8000/en/ in the browser.

## Build

```bash
python3 download_data.py
python3 -m http.server 8000 --directory build
```

Go to http://localhost:8000/en/ in the browser.

## Generating sprites

Install NVM then:
```bash
nvm use 8
npm install -g @mapbox/spritezero-cli
```

Generate sprites by running:
```bash
nvm use 8
spritezero --ratio 4 ./static/style/sprite ./static/icons/
```
## Deployment to AWS

1. Code is getting deployed using CodePipeline,
2. Static website is deployed to S3 bucket,
3. Reception points are generated on EC2 instance on regular basis,
4. Page is hosted behind CloudFront