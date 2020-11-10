import React, {useState} from "react";
import './PopupMapCartMobile.scss'
import {Clusterer, GeolocationControl, Map, Placemark, SearchControl, YMaps} from "react-yandex-maps";
import SvgClose from "../UI/icons/SvgClose";

const PopupMapCartMobile = props => {

  const [point, setPoint] = useState([56.010563, 92.852572])
  const [zoom, setZoom] = useState(11)
  const [activeMarker, setActiveMarker] = useState(null)
  const {retails, onSelectItem} = props;

  const popup = ({title, address, clock, tel}) => `
  <div>
    <p><strong>${title}</strong><br></p>
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
        iconCaption: '157р.'
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

  const close = (event) => {
    if (event.target.closest('.PopupMapCartMobile__close') || (!event.target.closest('.PopupMapCartMobile__content'))) {
      return props.onClick()
    }
  }

  return (
    <div className={"PopupMapCartMobile" + (props.active ? " PopupMapCartMobile_is-opened" : "")} onClick={close}>
      <div className="PopupMapCartMobile__content">
        <div className="PopupMapCartMobile__close">
          <SvgClose/>
        </div>
        <h1>Аптеки в г. Красноярск</h1>
        <div className='PopupMapCartMobile__mainContainer'>

          <YMaps>
            <Map className='PopupMapCartMobile__mapContainer'
                 state={mapState}
                 modules={['control.ZoomControl', 'control.FullscreenControl', "templateLayoutFactory", "layout.ImageWithContent"]}
            >
              <Clusterer
                options={{
                  preset: 'islands#invertedVioletClusterIcons',
                  groupByCoordinates: false,
                }}
              >
                {
                  retails.map(({retail, items, sum}) => {
                    const {coordinates, guid} = retail;
                    const popup = {
                      title: retail.title,
                      address: `г. ${retail.city},  ${retail.street} ${retail.buildNumber}`,
                      clock: retail.clock,
                      tel: retail.tel
                    }
                    const notFullItems = () => items.length < 3
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
                                   preset: 'islands#redStretchyIcon',
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

      </div>

    </div>
  )
}

export default PopupMapCartMobile