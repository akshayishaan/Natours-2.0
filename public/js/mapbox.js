/* eslint-disable */
export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYWtzaGF5aXNoYWFuc2ltIiwiYSI6ImNsZDdtdTF5ZTBkbTAzcXF4bGhxamVld2cifQ.vW3ftyYx-aOZgMtu9gdQOQ';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/akshayishaansim/cld7oaekk000001oma0f3uhd2',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      bottom: 150,
      top: 200,
      left: 100,
      right: 100,
    },
  });
};
