import React, {useEffect, useState} from "react"
import {YMaps, Map, Placemark, Clusterer, GeolocationControl, SearchControl} from "react-yandex-maps";
import iconLegko from '../../img/icon/legkoIconSmall.png'
import './Cities.scss'
import {clearCart, fetchRetailsCity, setIsCity} from "../../actions";
import {connect} from "react-redux";
import SelectDropdown from "../../components/UI/SelectDropdown/SelectDropdown";
import contactsLogo1 from '../../img/icon/contactsLocation.png'
import contactsLogo2 from '../../img/icon/contactsMail.png'
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import PopupConfirm from "../../components/PopupConfirm/PopupConfirm";


const Cities = props => {

  const [point, setPoint] = useState([56.010563, 92.852572])
  const [zoom, setZoom] = useState(11)
  const [activeMarker, setActiveMarker] = useState(null)
  const {isCity, retailsCity} = props;
  const [activeButton, setActiveButton] = useState(0)
  const [popupConfirmActive, setPopupConfirmActive] = useState(false)
  const [itemGuid, setItemGuid] = useState(null)
  const [activeElementForDropDown, setActiveElementForDropDown] = useState(null)

  useEffect(() => {
    setActiveElementForDropDown(arrayCitiesForDropdown().find(el => el.id === isCity.guid))
    // eslint-disable-next-line
  }, [isCity])


  const confirmMessage = <><p>При смене города корзина будет очищена.</p>
    <p>Желаете сменить город?</p></>

  const popup = ({title, address, clock, tel}) => `
  <div class="mapBalloon">
    <p class="mapBalloon__title"><strong>${title}</strong><br></p>
    <span class="mapBalloon__lineDecor"></span>
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

  const worksNow = () => {
    if (props.retailsCity?.length > 0 && activeMarker) {
      const activeRetail = props.retailsCity.find(el => el.guid === activeMarker)
      const clockArr = activeRetail?.weekDayTime.match(/\d\d:\d\d/g) || []
      const hours = new Date().getHours()
      // const minutes = new Date().getMinutes()
      // const timeNow = `${hours}:${minutes}`
      // const timeNow = '18:01'

      if (clockArr.length) {
        const hoursArr = clockArr.map(item => item.match(/^\d+/g))
        return ((+hoursArr[0] <= +hours) && (+hours < +hoursArr[1]))
      }
    }
    return null
  }

  const arrayCitiesForDropdown = () => props.cities.map(el => ({id: el.guid, value: el.title}))

  return (
    <div className='Cities wrapper'>
      <ErrorBoundary>
        {
          props.contacts &&
          <div className='contacts'>
            <h2 className='contacts__title'>Головной офис</h2>
            <div className='contacts__block'>
              <div className="contacts__location contacts__contactBlock">
                <img className='contacts__logo' src={contactsLogo1} alt="логотип локации"/>
                <div className="contacts__address">
                  <p className='contacts__city'>г. Красноярск</p>
                  <p className='contacts__street'>ул. Вавилова 1 стр. 39</p>
                  <p className='contacts__build'>ТК "Атмосфера дома"</p>
                </div>
              </div>
              <div className="contacts__mail contacts__contactBlock">
                <img className='contacts__logo' src={contactsLogo2} alt="логотип email"/>
                <div className="contacts__contact">
                  <p className='contacts__text-contact'>info@aptekalegko.ru</p>
                </div>
              </div>
            </div>
          </div>
        }
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
                {
                  worksNow()
                    ? <p className='Cities__worksNow'>Работает сейчас</p>
                    : <>{activeMarker && <p className='Cities__worksNow' style={{color: 'red'}}>Закрыто</p>}</>
                }
                <div className='Cities__dropdownCities'>
                  <p>Город:</p>
                  {
                    arrayCitiesForDropdown()?.length > 0
                    && <SelectDropdown items={arrayCitiesForDropdown()}
                                       activeElement={activeElementForDropDown}
                                       selectItem={(guid) => {
                                         setItemGuid(guid)
                                         setPopupConfirmActive(true)
                                       }}
                    />
                  }
                </div>

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
                                              iconImageHref: iconLegko, // своя иконка
                                              iconImageSize: [45, 61], // размеры нашей иконки
                                              iconImageOffset: [-22, -61], // сдвиг иконки
                                              hideIconOnBalloonOpen: false, //запрет на скрытие метки по клику на балун
                                              balloonOffset: [3, -30] // сдвиг балуна
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
        <PopupConfirm show={popupConfirmActive}
                      title={'Внимание!'}
                      message={confirmMessage}
                      onConfirm={() => {
                        props.clearCart()
                        const itemCity = props.cities.find(el => el.guid === itemGuid)
                        props.setIsCity(itemCity)
                        setPopupConfirmActive(false)
                      }}
                      onClose={() => {
                        setPopupConfirmActive(false)
                      }}/>
      </ErrorBoundary>
    </div>
  )
}

const mapStateToProps = ({cities, isCity, retailsCity}) => ({cities, isCity, retailsCity})

const mapDispatchToProps = (dispatch) => {
  return {
    fetchRetailsCity: () => dispatch(fetchRetailsCity()),
    setIsCity: (item) => dispatch(setIsCity(item)),
    clearCart: () => dispatch(clearCart())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cities)
