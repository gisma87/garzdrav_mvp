import React, {useEffect} from "react"
import {YMaps, Map, Placemark, Clusterer, GeolocationControl, SearchControl} from "react-yandex-maps";
import iconLoc from '../../img/test/map-pin.svg'
import iconGZ from '../../img/iconmap/gz.png'
import iconDA from '../../img/iconmap/da.png'
import './Cities.scss'
import LayoutDesktop from "../../hoc/LayoutDesktop";
import points from "../../testData/points";

const Cities = () => {

  const keyGeocode = 'a4f732e5-2172-4695-ac03-e3a81556557e'
  const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${keyGeocode}&format=json&geocode=`
  const getGeoCode = async () => {
    const res = await fetch(url + 'Красноярск, Вавилова, 39')
    if (!res.ok) {
      throw new Error(`Не могу выполнить fetch ${this.url}, статус ошибки: ${res.status}`)
    }
    return await res.json();
  }
  const geoCode = async () => {
    const res = await getGeoCode()
    return await res.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ')
  }

  useEffect(() => {
    geoCode()
      .then((arr) => {
        const x = arr[1]
        const y = arr[0]
        console.log('x = ', x)
        console.log('y = ', y)
      })
  })

  const popup = `
  <div>
    <p><strong>Гармония здоровья</strong><br></p>
    <ul>
      <li><strong>Адрес:&nbsp;</strong>г. Красноярск , ул. Академика Вавилова, 1 стр. 39</li>
      <li><strong>Часы работы:&nbsp;</strong>9:00 - 22:00</li>
      <li><strong>Телефон:&nbsp;</strong>(391) 274-29-79</li>
    </ul>
  </div>`
  const mapState = {
    center: [56.010563, 92.852572],
    zoom: 9,
    controls: ['zoomControl', 'fullscreenControl']
  };
  const placeMark = {
    properties: {
      balloonContentBody: popup,
      hintContent: 'Гармония здоровья',
      // balloonContent: 'Гармония здоровья',
      iconCaption: '157р.'
    },
    modules: ['geoObject.addon.balloon', 'geoObject.addon.hint']
  }
  let iconImage = iconLoc;

  function setIcon(type) {
    switch (type) {
      case 'gz':
        return iconImage = iconGZ;
      case 'da':
        return iconImage = iconDA;
      default:
        return iconImage = iconLoc;
    }
  }

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

  return (
    <YMaps
      query={{
        apikey: 'a4f732e5-2172-4695-ac03-e3a81556557e&lang=ru_RU',
      }}
      version={"2.1"}
    >
      <LayoutDesktop>
        <div className='Cities'>
          <h1>Города</h1>
          <Map className='Cities__mapContainer' defaultState={mapState}
               modules={['control.ZoomControl', 'control.FullscreenControl', "templateLayoutFactory", "layout.ImageWithContent"]}
          >
            {/*<Placemark*/}
            {/*  modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}*/}
            {/*  defaultGeometry={[56.010563, 92.852572]}*/}
            {/*  properties={{*/}
            {/*    balloonContentBody:*/}
            {/*      'эта штука написано в balloonContentBody в Placemark',*/}
            {/*    hintContent: 'Атмосфера дома',*/}
            {/*    balloonContent: 'Гармония здоровья',*/}
            {/*    iconCaption: 'asd'*/}
            {/*  }}*/}
            {/*  options={{*/}
            {/*    iconLayout: 'default#imageWithContent',*/}
            {/*    iconImageHref: iconLoc,*/}
            {/*    iconImageSize: [30, 42],*/}
            {/*    iconImageOffset: [-5, -38],*/}
            {/*  }}*/}
            {/*/>*/}

            <Clusterer
              options={{
                preset: 'islands#invertedVioletClusterIcons',
                groupByCoordinates: false,
              }}
            >
              {points.map(({coordinates, type}, index) => (
                <Placemark key={index}
                           {...placeMark}
                           geometry={coordinates}
                           options={{
                             // iconLayout: 'default#imageWithContent',
                             iconLayout: 'default#image',
                             iconImageHref: setIcon(type),
                             iconImageSize: [45, 61],
                             iconImageOffset: [-22, -61],
                           }}
                />
              ))}
            </Clusterer>
            <GeolocationControl options={{float: 'left'}}/>
            <SearchControl options={{float: 'right'}}/>
          </Map>
        </div>
      </LayoutDesktop>
    </YMaps>
  )
}

export default Cities
