'use strict';
//haeLatauspisteet();
const punainenIkoni = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const keltainenIkoni = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
let osoite3;
const osoite =
    'http://api.digitransit.fi/routing/v1/routers/hsl/bike_rental';
function haeparkit(crd) {
  const parametrit = `?x=${crd.latitude}&y=${crd.longitude}`;
  const url = osoite + parametrit;
  fetch(url)
  .then(function(vastaus) {
    return vastaus.json();
  })
  .then(function(parkit) {
    console.log(parkit);
    for (let i = 0; i < parkit.stations.length; i++) {

        const koordinaatit = {
            lat: parkit.stations[i].y,
            lng: parkit.stations[i].x,
        };
        /*const radian = +(Math.PI / 180);
        console.log(crd.latitude);
        var R = 6371e3; // metres
        var φ1 = crd.latitude * radian;
        var φ2 = koordinaatit.lat * radian;
        var Δφ = (koordinaatit.lat - crd.latitude) * radian;
        var Δλ = (koordinaatit.lng - crd.longitude) * radian;

        var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        var d = R * c;
        if (d < 5000) {*/

            const otsikko = parkit.stations[i].name;
            const maara = parkit.stations[i].bikesAvailable;
            const paikkojajaljella = parkit.stations[i].spacesAvailable;
            const kapasiteetti = (+maara) + (+paikkojajaljella);
            const marker = L.marker([koordinaatit.lat, koordinaatit.lng], {icon: keltainenIkoni}).addTo(map);
            marker.addEventListener('click', function (event) {
              popUpcordinaatit.lat=marker.getLatLng().lat;
              popUpcordinaatit.lng =marker.getLatLng().lng;
                osoite3 = 'Ei osoitetta';
                geoCode(koordinaatit);
                setTimeout(function () {

                    console.log(osoite3);
                    marker.bindPopup(otsikko + '<br>' + osoite3 + '<br>' + 'Pyörien määrä: ' + paikkojajaljella + '/' + kapasiteetti+lähtöpiste + maalipiste)
                }, 1000);
            });
    }
  })
  .catch(function(virhe) {
    console.log(virhe);

  });
}
function omaSijainti(crd, teksti, ikoni) {

  console.log(crd.latitude+' ' +' '+ crd.longitude);
  const omaMarker = L.marker([crd.latitude, crd.longitude], {icon: ikoni}).addTo(map)
  .bindPopup(teksti + lähtöpiste)
  .openPopup();
    osoite3 = 'Sinun sijanti';
    popUpcordinaatit.lat = crd.latitude;
    popUpcordinaatit.lng = crd.longitude;
    omaMarker.on('click',function() {
      osoite3 = 'Sinun sijanti';
      popUpcordinaatit.lat = crd.latitude;
      popUpcordinaatit.lng = crd.longitude;
    })
}
L.esri.Support.cors = false;
var geocodeService = L.esri.Geocoding.geocodeService();
 function geoCode(koordinaatit2){
   let tiedot =  geocodeService.reverse().latlng([koordinaatit2.lat, koordinaatit2.lng]).run(function(error, result) {
    if (error) {
      return;
    }
    console.log(result.address);
    console.log(result.address.Match_addr);
    osoite3 = `${result.address.Match_addr}`;
    //console.log(osoite4);
    //return osoite4;

  });
   console.log(tiedot);
   return;
}
const osoite2 =
    'https://nominatim.openstreetmap.org/reverse?format=geojson&';
function haeparkit2(crd) {
  const parametrit = `lat=${crd.lat}&lon=${crd.lng}`;
  const url = osoite2 + parametrit;
   fetch(url, {
    mode: 'cors'
  })
  .then(function(vastaus) {
    return vastaus.json();
  })
  .then(function(parkit) {
    console.log(parkit);
    return parkit.features.properties.address.road;
  })
  .catch(function(virhe) {
    console.log(virhe);

  });
}


