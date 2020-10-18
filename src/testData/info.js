import React from "react";
import DG from "2gis-maps";
import iconLoc from "../img/test/map-pin.svg";
import LayoutDesktop from "../hoc/LayoutDesktop";


// запрос, отправленный бэкендерами:
const test = () => {
  var request = new XMLHttpRequest();
  request.open("GET", "http://172.16.17.7:5000/cities/");
  request.onreadystatechange = reqReadyStateChange;
  request.send();

  function reqReadyStateChange() {
    if (request.readyState === 4) {
      var status = request.status;
      if (status === 200)
        console.log(request.responseText);
      else
        console.log(request.statusText);
    }
  }
}
test()

//мой запрос, который получился:
fetch('http://172.16.17.7:5000/Retails',
  {
    method: 'GET',
    headers: {
      accept: 'application/json'
    }
  }
)
  .then((response) => {
    return response.json()
  })
  .then((data) => {
    console.log(data);
  })
  .catch((err) => console.log("ОШИБКА ЗАПРОСА", err))


// Класс работы с 2Gis Maps
class GisMap extends React.Component {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  keyGeocode = 'a4f732e5-2172-4695-ac03-e3a81556557e'
  url = `https://geocode-maps.yandex.ru/1.x/?apikey=${this.keyGeocode}&format=json&geocode=`
  getGeoCode = async () => {
    const res = await fetch(this.url + 'Красноярск, Вавилова, 39')
    if (!res.ok) {
      throw new Error(`Не могу выполнить fetch ${this.url}, статус ошибки: ${res.status}`)
    }
    return await res.json();
  }
  geoCode = async () => {
    const res = await this.getGeoCode()
    return await res.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ')
  }

  componentDidMount() {
    this.geoCode()
      .then((arr) => {
        const x = arr[1]
        const y = arr[0]
        const map = DG.map(this.myRef.current, {
          center: [x, y],
          zoom: 13
        });
        const marker = DG.marker([x, y], {icon: this.garzdravIcon}).addTo(map)
        DG.control.location({position: 'bottomright'}).addTo(map);
        const popup = DG.popup({minWidth: 420, sprawling: true})
          .setLatLng([x, y])
          .setContent(this.popup)
          .openOn(map);
        marker.bindPopup(popup)
      })
  }

  garzdravIcon = DG.icon({
    iconUrl: `${iconLoc}`,
    iconRetinaUrl: {iconLoc},
    iconSize: [50, 40],
    iconAnchor: [25, 40],
    popupAnchor: [0, 0],
    // shadowUrl: 'my-icon-shadow.png',
    // shadowRetinaUrl: 'my-icon-shadow@2x.png',
    // shadowSize: [68, 95],
    // shadowAnchor: [22, 94]
  });
  popup = `
  <div>
    <p><strong>Гармония здоровья</strong><br></p>
    <ul>
      <li><strong>Адрес:&nbsp;</strong>г. Красноярск , ул. Академика Вавилова, 1 стр. 39</li>
      <li><strong>Часы работы:&nbsp;</strong>9:00 - 22:00</li>
      <li><strong>Телефон:&nbsp;</strong>(391) 274-29-79</li>
    </ul>
  </div>`

  render() {
    return (
      <LayoutDesktop>
        <div className='Cities'>
          <h1>Города</h1>
          <div id="map" className='Cities__mapContainer' ref={this.myRef} style={{width: '70%', height: 500}}/>
        </div>
      </LayoutDesktop>
    )
  }
}