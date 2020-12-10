import React, {useEffect, useState} from "react"
import {YMaps, Map, Placemark, Clusterer, GeolocationControl, SearchControl} from "react-yandex-maps";
import iconLoc from '../../img/test/map-pin.svg'
import iconGZ from '../../img/iconmap/gz.png'
import iconDA from '../../img/iconmap/da.png'
import iconBS from '../../img/iconmap/bs.png'
import iconOP from '../../img/iconmap/op.png'
import iconEV from '../../img/iconmap/evalar.png'
import './Cities.scss'
import {fetchRetailsCity} from "../../actions";
import {connect} from "react-redux";
import BlockWrapper from "../../components/BlockWrapper";

const Cities = props => {

  const [point, setPoint] = useState([56.010563, 92.852572])
  const [zoom, setZoom] = useState(11)
  const [activeMarker, setActiveMarker] = useState(null)
  const {isCity, retailsCity} = props;

  const popup = ({title, address, clock, tel}) => `
  <div>
    <p><strong>${title}</strong><br></p>
    <ul>
      <li><strong>Адрес:&nbsp;</strong>${address}</li>
      <li><strong>Часы работы:&nbsp;</strong>${clock}</li>
      <li><strong>Телефон:&nbsp;</strong>${tel}</li>
    </ul>
  </div>`

  const placeMark = (popupInfo) => {
    return {
      properties: {
        balloonContentBody: popup(popupInfo),
        hintContent: `${popupInfo.title}`,
        // balloonContent: 'Гармония здоровья',
        iconCaption: '157р.'
      },
      modules: ['geoObject.addon.balloon', 'geoObject.addon.hint']
    }
  }

  function setIcon(type) {
    switch (type) {
      case 'Гармония Здоровья':
        return iconGZ;
      case 'Дешёвая Аптека':
        return iconDA;
      case 'Эвалар':
        return iconEV;
      case 'Очень Оптика':
        return iconOP;
      case 'ВСЕМ (В7)':
        return iconBS;
      default:
        return iconLoc;
    }
  }

  useEffect(() => {
    props.fetchRetailsCity()
  }, [isCity.guid])// eslint-disable-line

  useEffect(() => {
    if (props.retailsCity.length) {
      setZoom(11)
      setPoint(props.retailsCity[0].coordinates)
    }
  }, [props.retailsCity])

  const mapState = {
    center: point,
    zoom: zoom,
    controls: ['zoomControl', 'fullscreenControl']
  };

  const onItemClick = (idMarker) => {
    setActiveMarker(idMarker)
    const activeItem = document.querySelector('.Cities__acitveItem');
    document.body.style.overflow = 'hidden'
    activeItem.scrollIntoView({block: "center"})
    document.body.style.overflow = 'auto'
    window.scrollTo(0, 0)
  }

  return (
    <div className='Cities wrapper'>
      <h1>Аптеки в г. {isCity.title}</h1>
      {retailsCity.length === 0
        ? <p>ЧТО-ТО ПОШЛО НЕ ТАК. ПОПРОБУЙТЕ ПЕРЕЗАГРУЗИТЬ СТРАНИЦУ</p>
        : <div className='Cities__mainContainer'>

          <BlockWrapper classStyle='Cities__retails'>
            <ul>
              {
                props.retailsCity.map((item) => {
                  const clockArr = item.weekDayTime.match(/\d\d:\d\d/g) || []
                  let clock = ''
                  if (clockArr.length > 1) {
                    clock = clockArr.join(' - ')
                  }

                  return <li
                    className={'Cities__retailItem' + (item.guid === activeMarker ? ' Cities__acitveItem' : '')}
                    key={item.guid}
                    onClick={() => {
                      setPoint(item.coordinates)
                      setZoom(17)
                      setActiveMarker(null)
                    }}
                  >
                    <span className='Cities__itemTitle'>{item.brand}</span>
                    <span className='Cities__itemAddress'>{item.street} {item.buildNumber}</span>
                    <span className='Cities__textClock'>Часы работы:&nbsp;{clock}</span>
                    <span className='Cities__textClock'>Тел.:&nbsp;{item.phone}</span>
                  </li>
                })
              }
            </ul>
          </BlockWrapper>

          <YMaps>
            <Map className='Cities__mapContainer'
                 state={mapState}
                 modules={['control.ZoomControl', 'control.FullscreenControl', "templateLayoutFactory", "layout.ImageWithContent"]}
            >
              <Clusterer
                options={{
                  preset: 'islands#invertedVioletClusterIcons',
                  groupByCoordinates: false,
                  minClusterSize: 2
                }}
              >
                {
                  props.retailsCity.map((item) => {
                    const {coordinates, guid, brand, city, street, buildNumber, phone} = item
                    const clockArr = item.weekDayTime.match(/\d\d:\d\d/g) || []
                    let clock = ''
                    if (clockArr.length > 1) {
                      clock = clockArr.join(' - ')
                    }
                    const popup = {
                      title: brand,
                      address: `г. ${city},  ${street} ${buildNumber}`,
                      clock,
                      tel: phone
                    }

                    return <Placemark key={guid}
                                      onClick={() => onItemClick(guid)}
                                      {...placeMark(popup)}
                                      geometry={coordinates}
                                      options={{
                                        // iconLayout: 'default#imageWithContent',
                                        iconLayout: 'default#image',
                                        iconImageHref: setIcon(brand),
                                        iconImageSize: [45, 61],
                                        iconImageOffset: [-22, -61],
                                      }}
                    />
                  })
                }
              </Clusterer>
              <GeolocationControl options={{float: 'left'}}/>
              <SearchControl options={{float: 'right'}}/>
            </Map>
          </YMaps>

        </div>}
    </div>
  )
}

const mapStateToProps = ({cities, isCity, retailsCity}) => {
  return {cities, isCity, retailsCity}
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchRetailsCity: () => dispatch(fetchRetailsCity())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cities)
