'use strict'

const map = L.map('map');
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
  const crd = pos.coords;

  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);

  paivitaKartta(crd);

  lisaaMarker(crd);
}


function paivitaKartta(crd)
{
  map.setView([crd.latitude, crd.longitude], 13);
}


function lisaaMarker(crd)
{
  L.marker([crd.latitude, crd.longitude]).addTo(map)
  .bindPopup('Olen tässä.')
  .openPopup();
}



function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);