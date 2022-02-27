FROM python:3.10-alpine

ENV PIP_NO_CACHE_DIR="false"

RUN apk add --no-cache python3-dev libffi-dev gcc g++ musl-dev make geos-dev

WORKDIR /app

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . .
RUN python download_data.py
RUN python generate_sites.py

EXPOSE 8000
CMD [ "python", "debug-app.py", "--host", "0.0.0.0" ]
