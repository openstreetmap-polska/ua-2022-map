# ua-2022-map
Map of reception points for refugees near Polish-Ukrainian border

work in progress...


# Local development environment setup
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
python3 generate_sites.py
python3 -m http.server
```

Go to http://localhost:8000/en/ in the browser.
