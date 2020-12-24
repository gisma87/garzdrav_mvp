import React, {useEffect, useState} from "react"
import {YMaps, Map, Placemark, Clusterer, GeolocationControl, SearchControl} from "react-yandex-maps";
import iconLegko from '../../img/icon/legkoIconSmall.png'
import './Cities.scss'
import {fetchRetailsCity} from "../../actions";
import {connect} from "react-redux";

const Cities = props => {

  const [point, setPoint] = useState([56.010563, 92.852572])
  const [zoom, setZoom] = useState(11)
  const [activeMarker, setActiveMarker] = useState(null)
  const {isCity, retailsCity} = props;
  const [activeButton, setActiveButton] = useState(0)

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
      },
      modules: ['geoObject.addon.balloon', 'geoObject.addon.hint']
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
      <h1>Аптеки в городе {isCity.title}</h1>
      {
        retailsCity.length === 0
          ? <p>ЧТО-ТО ПОШЛО НЕ ТАК. ПОПРОБУЙТЕ ПЕРЕЗАГРУЗИТЬ СТРАНИЦУ</p>
          : <div className='Cities__mainContainer'>
            <div className='Cities__menu'>
              <div className='Cities__buttonContainer'>
                <button className={'Cities__menuButton ' + (activeButton === 0 ? 'Cities__menuButtonActive' : '')}
                        onClick={() => setActiveButton(0)}
                >Показать на карте
                </button>
                <button className={'Cities__menuButton ' + (activeButton === 1 ? 'Cities__menuButtonActive' : '')}
                        onClick={() => setActiveButton(1)}
                >Показать списком
                </button>
              </div>
              <div className='Cities__dropdownCities'>Город: {isCity.title}</div>
            </div>
            <div className='Cities__startContainer' style={activeButton === 0 ? {display: 'flex'} : {display: 'none'}}>
              <YMaps>
                <Map className='Cities__mapContainer'
                     state={mapState}
                     modules={['control.ZoomControl', 'control.FullscreenControl', "templateLayoutFactory", "layout.ImageWithContent"]}
                >
                  <Clusterer
                    options={{
                      preset: 'islands#nightClusterIcons',
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
                                            iconImageHref: iconLegko,
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

              <div className='Cities__retails'>
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
                          setZoom(18)
                          setActiveMarker(item.guid)
                        }}
                      >
                        <span className='Cities__itemTitle'>{item.brand}</span>
                        <span className='Cities__lineDecor'> </span>
                        <span className='Cities__itemAddress'><b>Адрес:</b> {item.street} {item.buildNumber}</span>
                        <span className='Cities__textClock'><b>Часы работы:</b>&nbsp;{clock}</span>
                        <span className='Cities__textClock'><b>Контактный телефон:</b>&nbsp;{item.phone}</span>
                      </li>
                    })
                  }
                </ul>
              </div>
            </div>
            <div className='Cities__startContainer' style={activeButton === 1 ? {display: 'flex'} : {display: 'none'}}>
              <ul>
                {
                  props.retailsCity.map((item) => {
                    const clockArr = item.weekDayTime.match(/\d\d:\d\d/g) || []
                    let clock = ''
                    if (clockArr.length > 1) {
                      clock = clockArr.join(' - ')
                    }
                    return <li
                      className={'Cities__retailItemList' + (item.guid === activeMarker ? ' Cities__acitveItem' : '')}
                      key={item.guid}
                      onClick={() => {
                        setPoint(item.coordinates)
                        setZoom(18)
                        setActiveMarker(item.guid)
                      }}
                    >
                      <div className='Cities__blockItem'>
                        <span className='Cities__itemTitle'>{item.brand}</span>
                      </div>
                      <div className='Cities__blockAddress Cities__blockItem'>
                        <span className='Cities__itemAddress'><b>Адрес:</b> {item.street} {item.buildNumber}</span>
                        <span className='Cities__textClock'><b>Часы работы:</b>&nbsp;{clock}</span>
                        <span className='Cities__textClock'><b>Контактный телефон:</b>&nbsp;{item.phone}</span>
                      </div>
                      <div className='Cities__blockItem Cities__listButtonContainer'>
                        <button className='Cities__menuButton Cities__menuButton_notMargin' onClick={() => {
                          setActiveButton(0)
                          window.scrollTo({
                            top: 0,
                            left: 0,
                            behavior: 'smooth'
                          });
                        }}>
                          показать на карте
                        </button>
                      </div>
                    </li>
                  })
                }
              </ul>
            </div>
          </div>
      }
    </div>
  )
}

const mapStateToProps = (
  {
    cities, isCity, retailsCity
  }
) => {
  return {cities, isCity, retailsCity}
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchRetailsCity: () => dispatch(fetchRetailsCity())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cities)
