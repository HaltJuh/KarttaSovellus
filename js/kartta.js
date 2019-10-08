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
function success(pos) {
  const crd = pos.coords;
  alkupiste.latitude=crd.latitude;
  alkupiste.longitude=crd.longitude;
  console.log(alkupiste);
  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);

  paivitaKartta(crd);

  lisaaMarker(crd, 'olen tässä');
  //lisaaMarker(alkupiste,"Alkupiste");
  lisaaMarker(loppupiste, "Loppupiste");
  const asetukset = {

    method: 'POST',
    headers: {'Content-Type': 'application/graphql'},
    body: `{
  plan(
    fromPlace: "${alkupiste.latitude},${alkupiste.longitude}",
    toPlace: "60.168992,24.932366",
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
        const polylinePoints = [];
        console.log(tulos);
        let väri = '';
        for(let i = 0;i<tulos.data.plan.itineraries[0].legs.length;i++)
        {
          polylinePoints.push([decode(tulos.data.plan.itineraries[0].legs[i].legGeometry.points)]); //tulos.data.plan.itineraries[0].legs[i].from.lat,tulos.data.plan.itineraries[0].legs[i].from.lon]);

          if(i == tulos.data.plan.itineraries[0].legs[0])
          {
            //polylinePoints.push(tulos.data.plan.itineraries[0].legs[i].to.lat,tulos.data.plan.itineraries[0].legs[i].to.lon);
          }
          else
          {

          }
        }

        console.log(tulos.data.plan.itineraries[0].legs);
        console.log(polylinePoints);
        const polyline = L.polyline(
            polylinePoints
        ).addTo(map);
      });

}

function paivitaKartta(crd) {
  map.setView([crd.latitude, crd.longitude], 13);
}

const alkupiste = {
  latitude :  0,
  longitude : 0
};
const loppupiste = {
  latitude : 60.168992,
  longitude: 24.932366
};

function lisaaMarker(crd, teksti) {
  L.marker([crd.latitude, crd.longitude]).
      addTo(map).
      bindPopup(teksti).
      openPopup();
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);