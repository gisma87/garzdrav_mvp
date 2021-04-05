import React, {useEffect, useRef, useState} from "react";
import BlockWrapper from "../BlockWrapper";
import {Clusterer, GeolocationControl, Map, Placemark, SearchControl, YMaps} from "react-yandex-maps";
import iconLegko from "../../img/icon/legkoIconSmall.png";
import {fetchRetailsCity} from "../../actions";
import {connect} from "react-redux";
import {StateType} from "../../store";
import {ThunkDispatch} from "redux-thunk";
import {retailCity, TypeisCity} from "../../types";
import {scrollToElement} from "../../utils/scrollToElement";

type MapStatePropsType = {
    cities: TypeisCity[],
    isCity: TypeisCity,
    retailsCity: retailCity[]
}

type MapDispatchPropsType = {
    fetchRetailsCity: () => void
}

type Props = MapStatePropsType & MapDispatchPropsType & {
    showCitiesList: boolean,
    setShowCitiesList(val: boolean): void,
    retails?: retailCity[]
}

type popupDataType = { title: string, address: string, clock: string, tel: string }

const RetailsBlock: React.FC<Props> = props => {
    const [point, setPoint] = useState([56.010563, 92.852572])
    const [zoom, setZoom] = useState(11)
    const [activeMarker, setActiveMarker] = useState(null)
    const [acitveRetailList, setActiveRetailList] = useState<retailCity[]>()
    const {isCity} = props;

    const mapRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        props.retails
            ? setActiveRetailList(props.retails)
            : setActiveRetailList(props.retailsCity)
    }, [props.retails, props.retailsCity])

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

    const popup = ({title, address, clock, tel}: popupDataType) => `
  <div>
    <p><strong>${title}</strong><br></p>
    <ul>
      <li><strong>Адрес:&nbsp;</strong>${address}</li>
      <li><strong>Часы работы:&nbsp;</strong>${clock}</li>
      <li><strong>Телефон:&nbsp;</strong><a href="tel:${tel}">${tel}</a></li>
    </ul>
  </div>`

    const placeMark = (popupInfo: popupDataType) => {
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

    return (
        <div ref={mapRef} className='CitiesMobile__mainContainer'>
            <div className='CitiesMobile__menu'>
                <p onClick={() => props.setShowCitiesList(false)}
                   className={'CitiesMobile__btn ' + (!props.showCitiesList ? 'CitiesMobile__btn_active' : '')}
                >Список</p>
                <p onClick={() => props.setShowCitiesList(true)}
                   className={'CitiesMobile__btn ' + (props.showCitiesList ? 'CitiesMobile__btn_active' : '')}
                >Карта</p>
            </div>

            {!props.showCitiesList && acitveRetailList && <BlockWrapper classStyle='CitiesMobile__retails'>
              <ul>
                  {
                      acitveRetailList.map((item) => {
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


                              <span className='CitiesMobile__itemAddress'
                                    onClick={() => {
                                        setZoom(15)
                                        props.setShowCitiesList(true)
                                        if (mapRef && mapRef.current) {
                                            scrollToElement({element: mapRef.current, offset: -100, smooth: true})
                                        }

                                    }}>{item.street} {item.buildNumber}</span>
                              <span className='CitiesMobile__textClock'>Часы работы:&nbsp;{clock}</span>
                              <a className='CitiesMobile__textClock'
                                 href={`tel:${item.phone}`}>Тел.:&nbsp;{item.phone}</a>
                          </li>
                      })
                  }
              </ul>
            </BlockWrapper>}

            {acitveRetailList &&
            <div id="anchor" className='CitiesMobile__mapWrapper'
                 style={props.showCitiesList ? {display: 'block'} : {}}>

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
                          acitveRetailList.map((item) => {
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
    )
}

const mapStateToProps = ({cities, isCity, retailsCity}: StateType): MapStatePropsType => {
    return {cities, isCity, retailsCity}
}

const mapDispatchToProps = (dispatch: ThunkDispatch<StateType, {}, any>): MapDispatchPropsType => {
    return {
        fetchRetailsCity: () => dispatch(fetchRetailsCity())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RetailsBlock)