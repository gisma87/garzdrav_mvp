import React, {useEffect, useState} from "react"
import {YMaps, Map, Placemark, Clusterer, GeolocationControl, SearchControl} from "react-yandex-maps";
import iconLoc from '../../img/test/map-pin.svg'
import iconGZ from '../../img/iconmap/gz.png'
import iconDA from '../../img/iconmap/da.png'
import './Cities.scss'
import points from "../../testData/points";
import {fetchCities, fetchRetailsCity, retailsCityLoaded} from "../../actions";
import {compose} from "../../utils";
import withStoreService from "../../hoc/withStoreService/withStoreService";
import {connect} from "react-redux";
import StoreService from "../../service/ApiService";
import BlockWrapper from "../../components/BlockWrapper";


const MapGZ = (props) => {
  const {placeMark, setIcon, point} = props.item;

  // let centerPoint = points[1].coordinates;
  let zoomPoint = 17;
  useEffect(() => {
    // centerPoint = points[point].coordinates;
    zoomPoint = 17;
    console.log('ПОИНТЫ ', point.coordinates)
  }, [point])

  if (true) {
    return (
      <YMaps
        query={{
          apikey: 'a4f732e5-2172-4695-ac03-e3a81556557e&lang=ru_RU',
        }}
        version={"2.1"}
      >
        <Map className='Cities__mapContainer' defaultState={
          {
            center: point.coordinates,
            zoom: zoomPoint,
            controls: ['zoomControl', 'fullscreenControl']
          }
        }
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
            {
              points.map(({coordinates, type}, index) => (
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
              ))
            }
          </Clusterer>
          <GeolocationControl options={{float: 'left'}}/>
          <SearchControl options={{float: 'right'}}/>
        </Map>
      </YMaps>
    )
  }
}


const Cities = props => {

  const [point, setPoint] = useState({coordinates: [56.010563, 92.852572]})
  const {cities, isCity, retailsCity} = props;
  const storeService = new StoreService()
  const keyGeocode = 'a4f732e5-2172-4695-ac03-e3a81556557e'


  //Чтобы получить координаты. Не нужный код.
  // const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${keyGeocode}&format=json&geocode=`
  // const getGeoCode = async (address) => {
  //   const res = await fetch(url + address)
  //   if (!res.ok) {
  //     throw new Error.svg(`Не могу выполнить fetch ${this.url}, статус ошибки: ${res.status}`)
  //   }
  //   return await res.json();
  // }
  // const geoCode = async (address) => {
  //   const res = await getGeoCode(address)
  //   return await res.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ')
  // }


  // useEffect(() => {
  //   const newArr1 = [];
  //   const mutation = () => {
  //     // пример: 'Красноярск, Вавилова, 39'
  //     retailsCity.forEach((item) => {
  //       geoCode(`Красноярск, ${item.street}, ${item.buildNumber}`)
  //         .then((res) => {
  //           const {guid, title, street, buildNumber} = item;
  //           newArr1.push({
  //             guid,
  //             title,
  //             street,
  //             buildNumber,
  //             coordinates: [+res[1], +res[0]],
  //             type: 'gz'
  //           })
  //           // item.coordinates = [56.010563, 92.852572];
  //           // [+res[1], +res[0]];
  //           // item.type = 'gz';
  //         })
  //
  //       setMutationRetailsCity(newArr1)
  //     })
  //   }
  //   mutation()
  //   console.log('mutationRetailsCity', mutationRetailsCity);
  // }, [])

  useEffect(() => {
    storeService.getRetailsCity(isCity.guid)
      .then((data) => props.retailsCityLoaded(data))
      .catch((error) => console.log('ОШИБКА в fetchRetailsCity ', error));

    // geoCode()
    //   .then((arr) => {
    //     const x = arr[1]
    //     const y = arr[0]
    //     console.log('x = ', x)
    //     console.log('y = ', y)
    //   })
  }, [isCity.guid])

  // let centerPoint = points[1].coordinates;
  // let zoomPoint = 11;
  // useEffect(() => {
  //   if (point !== null) {
  //     centerPoint = points[point].coordinates;
  //     zoomPoint = 17;
  //     console.log('ПОИНТЫ ', centerPoint)
  //   }
  // })


  const popup = `
  <div>
    <p><strong>Гармония здоровья</strong><br></p>
    <ul>
      <li><strong>Адрес:&nbsp;</strong>г. Красноярск , ул. Академика Вавилова, 1 стр. 39</li>
      <li><strong>Часы работы:&nbsp;</strong>9:00 - 22:00</li>
      <li><strong>Телефон:&nbsp;</strong>(391) 274-29-79</li>
    </ul>
  </div>`
  // const mapState = {
  //   center: centerPoint,
  //   zoom: zoomPoint,
  //   controls: ['zoomControl', 'fullscreenControl']
  // };
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

  // fetch('http://172.16.17.7:5000/Retails',
  //   {
  //     method: 'GET',
  //     headers: {
  //       accept: 'application/json'
  //     }
  //   }
  // )
  //   .then((response) => {
  //     return response.json()
  //   })
  //   .then((data) => {
  //     console.log(data);
  //   })
  //   .catch((err) => console.log("ОШИБКА ЗАПРОСА", err))

  return (
    <div className='Cities wrapper'>
      <h1>Аптеки в г. {isCity.title}</h1>
      <div className='Cities__mainContainer'>

        <BlockWrapper classStyle='Cities__retails'>
          <ul>
            {
              points.map((item, index) => {
                return <li className='Cities__retailItem'
                           key={item.guid}
                           onClick={() => {
                             setPoint(item)
                           }}
                >
                  <span>{item.title}</span>
                  <span>{item.street} {item.buildNumber}</span>
                  <span>Часы работы:&nbsp;9:00 - 22:00</span>
                </li>
              })
            }
          </ul>
        </BlockWrapper>

        <MapGZ item={{placeMark, setIcon, point}}/>

      </div>
    </div>
  )
}

const mapStateToProps = ({cities, loading, error, isCity, retailsCity}) => {
  return {cities, loading, error, isCity, retailsCity}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  // const {storeService} = ownProps;
  return {
    // fetchCities: fetchCities(storeService, dispatch),
    // fetchRetailsCity: (data) => {fetchRetailsCity(storeService, dispatch, data)},
    retailsCityLoaded: (idCity) => {
      dispatch(retailsCityLoaded(idCity))
    }
  }
}

export default compose(
  withStoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(Cities)
