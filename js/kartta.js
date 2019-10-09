'use strict';

const map = L.map('map');
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};
let lähtöpiste = '<br/><button onclick="asetaLahtopiste()" type="button" >'+'Aseta lähtöpisteeksi'+'</button>';
let maalipiste = '<br/><button onclick="asetaMaaranpaa()" type="button" >'+'Aseta määränpääksi'+'</button>';
function asetaLahtopiste() {
alkupiste.latitude = popUpcordinaatit.lat;
alkupiste.longitude = popUpcordinaatit.lng;
console.log('alkupiste'+ alkupiste);
const alkupisteOsoite = document.getElementById('lähtöpiste').innerHTML = osoite3;
}
function asetaMaaranpaa() {
  loppupiste.latitude = popUpcordinaatit.lat;
  loppupiste.longitude = popUpcordinaatit.lng;
  console.log('loppupiste'+ loppupiste);
  const loppupisteOsoite = document.getElementById('loppupiste').innerHTML = osoite3;
}
const haku = document.getElementById('haku');
haku.addEventListener('click',function() {
  navigaatio(alkupiste,loppupiste);
})
function decode(value) {

  var values = decode.integers(value)
  var points = []

  for( var i = 0; i < values.length; i += 2 ) {
    points.push([
      ( values[ i + 0 ] += ( values[ i - 2 ] || 0 ) ) / 1e5,
      ( values[ i + 1 ] += ( values[ i - 1 ] || 0 ) ) / 1e5,
    ])
  }

  return points

}

decode.sign = function( value ) {
  return value & 1 ? ~( value >>> 1 ) : ( value >>> 1 )
}

decode.integers = function( value ) {

  var values = []
  var byte = 0
  var current = 0
  var bits = 0

  for (var i = 0; i < value.length; i++) {

    byte = value.charCodeAt(i) - 63
    current = current | ((byte & 0x1F) << bits)
    bits = bits + 5

    if (byte < 0x20) {
      values.push(decode.sign(current))
      current = 0
      bits = 0
    }

  }
  return values
}
let polyline;
function navigaatio(lähtö,maali) {
  const asetukset = {

    method: 'POST',
    headers: {'Content-Type': 'application/graphql'},
    body: `{
  plan(
    fromPlace: "${lähtö.latitude},${lähtö.longitude}",
    toPlace: "${maali.latitude},${maali.longitude}",
    numItineraries: 1,
    transportModes: [{mode: BICYCLE, qualifier: RENT}],
  ) {
    itineraries{
      walkDistance
      duration
      legs {
        mode
        startTime
        endTime
        from {
          lat
          lon
          name
          bikeRentalStation {
            stationId
            name
          }
        }
        to {
          lat
          lon
          name
          bikeRentalStation {
            stationId
            name
          }
        }
        distance
        legGeometry {
          length
          points
        }
      }
    }
  }
}`,
  };
  fetch('https://api.digitransit.fi/routing/v1/routers/finland/index/graphql',
      asetukset).
      then(function(tulos) {
        return tulos.json();
      }).
      then(function(tulos) {
        console.log(tulos);
        let aika =  tulos.data.plan.itineraries[0].duration;
        let minuutit = aika/60
        let tunnit = minuutit/60;
        if(tunnit>1)
        {
          const time = document.getElementById('aika');
          tunnit = Math.floor(tunnit);
          minuutit= Math.floor(minuutit%60);
          time.innerHTML=tunnit+' tuntia, '+minuutit + ' minuuttia';
        }
        else
        {
          const time = document.getElementById('aika');
          minuutit= Math.floor(minuutit);
          time.innerHTML= minuutit + ' minuuttia';
        }
        console.log('Aika '+ aika);
        console.log('Tunnit ja minuuti '+tunnit+':'+minuutit);
        const polylinePoints = [];
        console.log(tulos);
        for(let i = 0;i<tulos.data.plan.itineraries[0].legs.length;i++)
        {
          polylinePoints.push([decode(tulos.data.plan.itineraries[0].legs[i].legGeometry.points)]); //tulos.data.plan.itineraries[0].legs[i].from.lat,tulos.data.plan.itineraries[0].legs[i].from.lon]);
        }

        console.log(tulos.data.plan.itineraries[0].legs);
        console.log(polylinePoints);

        if (polyline != undefined)
        {
          console.log('removing' + polyline);
          map.removeLayer(polyline);
        }
         polyline = L.polyline(
            polylinePoints
        ).addTo(map);
      });
}


function success(pos) {
  const crd = pos.coords;
  //navigaatio(alkupiste,loppupiste)
  paivitaKartta(crd);

  omaSijainti(crd, 'Olet tässä',punainenIkoni);
  haeparkit(crd);
  //lisaaMarker(alkupiste,"Alkupiste");
  lisaaMarker(loppupiste, "Loppupiste");
}

function paivitaKartta(crd) {
  map.setView([crd.latitude, crd.longitude], 13);
}
let popUpOsoite = '';
const popUpcordinaatit = {
  lat: 0,
  lng: 0
};
const alkupiste = {
  latitude :  0,
  longitude : 0
};
const loppupiste = {
  latitude : 0,
  longitude: 0
};

function lisaaMarker(crd, teksti) {
  L.marker([crd.latitude, crd.longitude]).
      addTo(map).
      bindPopup(teksti)
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);
