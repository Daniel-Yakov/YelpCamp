mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 8, // starting zoom
});

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(campground.geometry.coordinates)
    .setPopup(new mapboxgl.Popup().setHTML(`<h3>${campground.title}</h3><p>${campground.location}</p>`)) // add popup
    .addTo(map);

map.addControl(new mapboxgl.NavigationControl());