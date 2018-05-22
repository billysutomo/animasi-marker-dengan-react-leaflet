import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import icoCloud from './assets/cloud.svg';
import icoSun from './assets/sun.svg';
let L = window.L;     // import leaflet dari native javascript
let map = window.map; // declare variable global untuk menampung peta hasil dari leaflet 
let svg = window.svg;
let d3 = window.d3;

class App extends Component {

  constructor() {
    super();
    this.state = {
      dataMarker: [
        { lat: -6.175104, lng: 106.827164 },
        { lat: -6.160410, lng: 106.787770 },
        { lat: -6.167170, lng: 106.887067 },
        { lat: -6.249427, lng: 106.905321 },
        { lat: -6.139619, lng: 106.943620 }
      ]
    }
  }

  componentDidMount() {
    this.initializeMap();
  }

  initializeMap = () => {
    map = L.map("map", {                // "map" adalah id dari element html
      center: [-6.175239, 106.827204],  // posisi fokus peta pertama kali dibuka
      zoom: 14,                         // level zoom peta pertama kali dibuka
    });

    L.tileLayer(
      "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png"
    ).addTo(map); // fungsi untuk menambahkan layer peta ke dalam leaflet
    // daftar link peta http://leaflet-extras.github.io/leaflet-providers/preview/

    L.svg().addTo(map);// menambah svg layer ke dalam leaflet
    d3.select("svg").attr("pointer-events", "all");// menggunakan d3 untuk menambahkan atribut "pointer-events" dengan value "all pada svg layer"
    d3.select("svg g").attr("class", "leaflet-zoom-hide");// menggunakan d3 untuk menambahkan element "g" pada svg, dan seterusnya "class" dengan value "leaflet-zoom-hide" pada element g
    svg = d3.select("svg g");
    this.drawMarker();
  };

  drawMarker = () => {
    let { dataMarker, icoHeight, icoWidth, icoAdjust } = this.state;
    dataMarker.map(item => {
      let point = projectPoint(item.lat, item.lng);// convert lat long ke x dan y di svg layer
      let sun = svg.append("svg:image")// menambahkan svg matahari
        .attr("xlink:href", icoSun)// link icon sun
        .attr("width", 30)// lebar icon sun
        .attr("height", 30)// tinggi icon sun 
        .attr("x", point.x - 15)// posisi x di svg layer
        .attr("y", point.y - 15)// posisi y di svg layer

      let cloud = svg.append("svg:image")
        .attr("xlink:href", icoCloud)// menambahkan svg awan
        .attr("width", 40)// lebar icon cloud
        .attr("height", 40)// lebar icon cloud
        .attr("x", point.x - 20)// posisi x di svg layer
        .attr("y", point.y - 20)// posisi y di svg layer
        .on("mouseover", function () {// listener mendeteksi mouse hovering di atas icon cloud
          sun.transition()// melakukan transisi icon sun ke atas
            .duration(1000)// durasi transisi dari awal sampai akhir
            .ease(d3.easeBounce)//tipe transisi, untuk daftar transisi bisa merujuk ke sini https://bl.ocks.org/d3noob/1ea51d03775b9650e8dfd03474e202fe
            .attr("y", projectPoint(item.lat, item.lng).y - 30)//melakukan perpindahan posisi y pada icon sun
          setTimeout(() => {// di set timeout, karena untuk menunggu transisi icon sun ke atas selesai terlebih dahulu
            sun.transition()// melakukan transisi icon sun ke posisi awal 
              .duration(1000)
              .attr("y", projectPoint(item.lat, item.lng).y - 15)
          }, 1000);
        })
      map.on("moveend", function () {// listener mendeteksi zoom in & out map
        // ketika terjadi zoom in & out di map, otomatis akan terjadi perubahan posisi map
        // oleh karena itu harus dilakukan update posisi marker
        updateMarker(sun, item.lat, item.lng, 15);
        updateMarker(cloud, item.lat, item.lng, 20);
      })
    })
}

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div id="map" /> {/* elemeny yang digunakan leaflet untuk load map */}
        <div>
          Icons made by
          <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a>
          from
          <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
          is licensed by
          <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
        </div>
        <div>Icons made by <a href="https://www.flaticon.com/authors/good-ware" title="Good Ware">Good Ware</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
      </div>
    );
  }
}

function projectPoint(lat, lng) {
  return map.latLngToLayerPoint([lat, lng]);// melakukan conversi lat & lng dari map, menjadi x & y di svg layer
}

function updateMarker(marker, lat, lng, adjustSize) {
  let loc = projectPoint(lat, lng)
  marker.attr("x", loc.x - adjustSize).attr("y", loc.y - adjustSize);// melakukan perubahan posisi x & y pada marker
}

export default App;
