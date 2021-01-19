import React, {useEffect, useState} from "react";
import './PopupMapCart.scss'
import BlockWrapper from "../BlockWrapper";
import {Clusterer, GeolocationControl, Map, Placemark, SearchControl, YMaps} from "react-yandex-maps";
import RetailItem from "../RetailItem";
import PopupWrapper from "../UI/PopupWrapper/PopupWrapper";

const PopupMapCart = props => {
  const [point, setPoint] = useState([56.010563, 92.852572])
  const [zoom, setZoom] = useState(11)
  const [activeMarker, setActiveMarker] = useState(null)
  const {retails, onSelectItem} = props;

  useEffect(() => {
    if (props.activeRetail) {
      const retail = retails.find(item => item.guid === props.activeRetail)
      setActiveMarker(props.activeRetail)
      setPoint(retail.coordinates)
      setZoom(17)
    }
  }, [props.active])

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

  const placeMark = (price, popupInfo, flag = false) => {
    return {
      properties: {
        iconContent: `<div class="icn_content ${flag ? 'colorRed' : ''}">${price} ₽</div>`,
        balloonContentBody: popup(popupInfo),
        hintContent: `${popupInfo.title}`,
        // balloonContent: 'Гармония здоровья',
        // iconCaption: '157р.'
      },
      modules: ['geoObject.addon.balloon', 'geoObject.addon.hint']
    }
  }

  const mapState = {
    center: point,
    zoom: zoom,
    controls: ['zoomControl', 'fullscreenControl']
  };


  const onItemClick = (idMarker) => {
    setActiveMarker(idMarker)
    const activeItem = document.querySelector('.RetailItem__activeItem');
    activeItem.scrollIntoView({behavior: "smooth"})
  }

  return (
    <PopupWrapper onClick={props.onClick} active={props.active} classStyle='PopupMapCart'>
      <h1>Аптеки в г. Красноярск</h1>
      <div className='PopupMapCart__mainContainer'>

        <BlockWrapper classStyle='PopupMapCart__retails'>
          <ul>
            {
              retails.map((retailItem) => {
                const notFullItems = () => retailItem.product.length < props.cartLength
                return (
                  <RetailItem
                    key={retailItem.guid}
                    retailItem={retailItem}
                    notFullItems={notFullItems()}
                    active={retailItem.guid === activeMarker}
                    buttonActive={props.activeRetail === retailItem.guid}
                    onSelectItem={() => onSelectItem(retailItem.guid)}
                    setMapSetting={() => {
                      setPoint(retailItem.coordinates)
                      setZoom(17)
                      setActiveMarker(null)
                    }}
                  />
                )
              })
            }
          </ul>
        </BlockWrapper>
        <YMaps>
          <Map className='PopupMapCart__mapContainer'
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
                retails.map((item) => {
                  if ((typeof item.coordinates !== 'object') || item.coordinates.length < 1) return null;
                  const {coordinates, guid, sum, brand, city, street, buildNumber, phone, weekDayTime, product} = item;
                  const popup = {
                    title: brand,
                    address: `г. ${city},  ${street} ${buildNumber}`,
                    clock: weekDayTime,
                    tel: phone
                  }
                  const notFullItems = () => product.length < props.cartLength
                  return (
                    <Placemark key={guid}
                               onClick={() => onItemClick(guid)}
                               {...placeMark(sum, popup, notFullItems())}
                               geometry={coordinates}
                               options={{
                                 // iconLayout: 'default#imageWithContent',
                                 // iconLayout: 'default#image',
                                 // iconImageHref: setIcon(type),
                                 // iconImageSize: [45, 61],
                                 // iconImageOffset: [-22, -61],
                                 preset: 'islands#nightStretchyIcon',
                                 draggable: false, // передвигать маркеры
                                 // iconColor: 'red'
                               }}
                    />
                  )
                })
              }
            </Clusterer>
            <GeolocationControl options={{float: 'left'}}/>
            <SearchControl options={{float: 'right'}}/>
          </Map>
        </YMaps>
      </div>
    </PopupWrapper>
  )
}

export default PopupMapCart