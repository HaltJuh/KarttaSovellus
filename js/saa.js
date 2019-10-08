'use strict';
const tuloste = document.getElementById('saa');
const xhrsaa = new XMLHttpRequest();

function hae() {
    xhrsaa.open('get', `http://api.openweathermap.org/data/2.5/forecast?id=658226&APPID=82459bd8956e05b8100a82dace85f749&units=metric`, true);
    xhrsaa.onreadystatechange = tiedot;
    xhrsaa.send(null);
}
    function tiedot() {
        if (xhrsaa.readyState === 4 && xhrsaa.status === 200) {
            for (let i = 0; i < 8; i++) {

            const saa = JSON.parse(xhrsaa.responseText);
            let lampo = saa.list[i].main.temp.toFixed(0);
            let icon = saa.list[i].weather[0].icon;
            let aika = saa.list[i].dt_txt;
            let tuuli = saa.list[i].wind;
            tuloste.innerHTML += `
<div class="saapalkki"><div class="aika">Klo ${aika.substr(11, 2)}</div>
<div class="lampo"> ${lampo}°C</div>
<div class="saakuva"><img src="http://openweathermap.org/img/wn/${icon}@2x.png"></div><div class="tuuli">💨 ${(tuuli.speed.toFixed(1))} m/s</div>
</div>`;
            console.log(lampo);
            }
            }
        }
    hae();
let teemu = '2019-10-02 15:00:00';
var testi = teemu.substr(11, 2);
console.log(testi);