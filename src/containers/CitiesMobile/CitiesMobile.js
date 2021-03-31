import React, {useEffect, useState} from "react"
import {YMaps, Map, Placemark, Clusterer, GeolocationControl, SearchControl} from "react-yandex-maps";
import './CitiesMobile.scss'
import {clearCart, fetchRetailsCity, setIsCity} from "../../actions";
import {connect} from "react-redux";
import BlockWrapper from "../../components/BlockWrapper";
import iconLegko from "../../img/icon/legkoIconSmall.png";
import SelectDropdown from "../../components/UI/SelectDropdown/SelectDropdown";
import contactsLogo1 from "../../img/icon/contactsLocation.png";
import contactsLogo2 from "../../img/icon/contactsMail.png";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import PopupConfirm from "../../components/PopupConfirm/PopupConfirm";

const CitiesMobile = props => {


  const [point, setPoint] = useState([56.010563, 92.852572])
  const [zoom, setZoom] = useState(11)
  const [activeMarker, setActiveMarker] = useState(null)
  const {isCity} = props;
  const [view, setView] = useState(false)

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
  <div>
    <p><strong>${title}</strong><br></p>
    <ul>
      <li><strong>Адрес:&nbsp;</strong>${address}</li>
      <li><strong>Часы работы:&nbsp;</strong>${clock}</li>
      <li><strong>Телефон:&nbsp;</strong><a href="tel:${tel}">${tel}</a></li>
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

  const arrayCitiesForDropdown = () => props.cities.map(el => ({id: el.guid, value: el.title}))

  return (
    <div className='CitiesMobile wrapper'>
      <ErrorBoundary>
        {
          (props.contacts && !view) &&
          <div className='contactsMobile'>
            <h2 className='contactsMobile__title'>Головной офис</h2>
            <div className='contactsMobile__block'>
              <div className="contactsMobile__location contactsMobile__contactBlock">
                <img className='contactsMobile__logo' src={contactsLogo1} alt="логотип локации"/>
                <div className="contactsMobile__address">
                  <p className='contactsMobile__city'>г. Красноярск</p>
                  <p className='contactsMobile__street'>ул. Вавилова 1 стр. 39</p>
                  <p className='contactsMobile__build'>ТК "Атмосфера дома"</p>
                </div>
              </div>
              <div className="contactsMobile__mail contactsMobile__contactBlock">
                <img className='contactsMobile__logo' src={contactsLogo2} alt="логотип email"/>
                <div className="contactsMobile__contact">
                  <p className='contactsMobile__text-contact'>info@aptekalegko.ru</p>
                </div>
              </div>
            </div>
          </div>
        }

        <header>
          <h1>Аптеки</h1>
          <div className='CitiesMobile__dropdownCities'>
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
        </header>


        <div className='CitiesMobile__mainContainer'>
          <div className='CitiesMobile__menu'>
            <p onClick={() => setView(false)}
               className={'CitiesMobile__btn ' + (!view ? 'CitiesMobile__btn_active' : '')}
            >Список</p>
            <p onClick={() => setView(true)}
               className={'CitiesMobile__btn ' + (view ? 'CitiesMobile__btn_active' : '')}
            >Карта</p>
          </div>

          {!view && <BlockWrapper classStyle='CitiesMobile__retails'>
            <ul>
              {
                props.retailsCity.map((item) => {
                  const clockArr = item.weekDayTime.match(/\d\d:\d\d/g) || []
                  let clock = ''
                  if (clockArr.length > 1) {
                    clock = clockArr.join(' - ')
                  }
                  return <li
                    className={'CitiesMobile__retailItem' + (item.guid === activeMarker ? ' Cities__acitveItem' : '')}
                    key={item.guid}
                    onClick={() => {
                      setPoint(item.coordinates)
                      setZoom(17)
                      setActiveMarker(null)
                    }}
                  >
                    <span className='CitiesMobile__itemTitle'>{item.brand}</span>
                    <span className='CitiesMobile__itemAddress'>
                    <span onClick={() => {
                      setZoom(15)
                      setView(true)
                    }}>{item.street} {item.buildNumber}</span>
                  </span>
                    <span className='CitiesMobile__textClock'>Часы работы:&nbsp;{clock}</span>
                    <a className='CitiesMobile__textClock' href={`tel:${item.phone}`}>Тел.:&nbsp;{item.phone}</a>
                  </li>
                })
              }
            </ul>
          </BlockWrapper>}

          {
            <div className='CitiesMobile__mapWrapper' style={view ? {visibility: 'visible'} : {}}>
              <YMaps>
                <Map className='CitiesMobile__mapContainer'
                     state={mapState}
                     modules={['control.ZoomControl', 'control.FullscreenControl', "templateLayoutFactory", "layout.ImageWithContent"]}
                >
                  <Clusterer
                    options={{
                      preset: 'islands#nightClusterIcons',
                      groupByCoordinates: false,
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
                          // onClick={() => onItemClick(guid)}
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
            </div>
          }

        </div>
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

const mapStateToProps = ({cities, isCity, retailsCity}) => {
  return {cities, isCity, retailsCity}
}

const mapDispatchToProps = (dispatch) => {
  return {
    setIsCity: (item) => dispatch(setIsCity(item)),
    fetchRetailsCity: () => dispatch(fetchRetailsCity()),
    clearCart: () => dispatch(clearCart())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CitiesMobile)
