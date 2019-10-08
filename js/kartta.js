'use strict';

// liitetään kartta elementtiin #map
const map = L.map('map');
// käytetään openstreetmapia
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Asetukset paikkatiedon hakua varten (valinnainen)
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};


// Funktio, joka ajetaan, kun paikkatiedot on haettu
function success(pos) {
  const crd = pos.coords;
  console.log('Omat' + crd.latitude + crd.longitude);
  // Tulostetaan paikkatiedot konsoliin
  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
  // näytetään kartta
  paivitaKartta(crd);
  // näytetään markkeri
  haeparkit(crd);
  omaSijainti(crd, 'Olen tässä', punainenIkoni);
}

// siirretään kartan päivitys omaan funktioon
function paivitaKartta(crd) {
  // Käytetään leaflet.js -kirjastoa näyttämään sijainti kartalla (https://leafletjs.com/)
  map.setView([crd.latitude, crd.longitude], 13);

}

// siirretään markkereiden lisäys omaan funktioon
function lisaaMarker(crd,teksti, ikoni, maara, jaljella, osoite) {
  console.log(crd.lat+' ' +' '+ crd.lng);
  const kapasiteetti = (+maara) + (+jaljella);
  L.marker([crd.lat, crd.lng], {icon: ikoni}).addTo(map)
  .bindPopup('<h3>' + teksti + '</h3>' +  'Pyörien saatavuus: ' + maara + '/' + kapasiteetti
  + '<br>' + osoite)

}


// Funktio, joka ajetaan, jos paikkatietojen hakemisessa tapahtuu virhe
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

// Käynnistetään paikkatietojen haku
navigator.geolocation.getCurrentPosition(success, error, options);