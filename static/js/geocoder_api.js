// Geocoder control setup:
// Based on this https://maplibre.org/maplibre-gl-js-docs/example/geocoder/
export const geocoder_api = {
  forwardGeocode: async (config) => {
    const features = [];
    try {
      // Set bounds to search within poland
      // viewbox=<x1>,<y1>,<x2>,<y2>
      // https://boundingbox.klokantech.com/

      // NOTE: One option to try is to use bounds to limit the results.
      // We can get the bounds as follows and then use them in the nominatim API request via the viewbox parameter.
      // let bounds = map.getBounds();
      // bounds.toArray().join(',')

      const pl_bounds = "11.82,48.36,27.39,55.16";
      let request =
        "https://nominatim.openstreetmap.org/search?q=" +
        config.query +
        `&viewbox=${pl_bounds}&bounded=1` +
        "&format=geojson&polygon_geojson=1&addressdetails=1";
      const response = await fetch(request);
      const geojson = await response.json();
      for (let feature of geojson.features) {
        let center = [
          feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
          feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
        ];
        let point = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: center,
          },
          place_name: feature.properties.display_name,
          properties: feature.properties,
          text: feature.properties.display_name,
          place_type: ["place"],
          center: center,
        };
        features.push(point);
      }
    } catch (e) {
      console.error(`Failed to forwardGeocode with error: ${e}`);
    }

    return {
      features: features,
    };
  },
};
