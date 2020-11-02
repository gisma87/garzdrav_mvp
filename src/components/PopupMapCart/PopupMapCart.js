import React, {useState} from "react";
import './PopupMapCart.scss'
// import iconLoc from "../../img/test/map-pin.svg";
// import iconGZ from "../../img/iconmap/gz.png";
// import iconDA from "../../img/iconmap/da.png";
import BlockWrapper from "../BlockWrapper";
import {Clusterer, GeolocationControl, Map, Placemark, SearchControl, YMaps} from "react-yandex-maps";
import SvgClose from "../UI/icons/SvgClose";

const PopupMapCart = props => {

  const [point, setPoint] = useState([56.010563, 92.852572])
  const [zoom, setZoom] = useState(11)
  const [activeMarker, setActiveMarker] = useState(null)
  const {retails, onSelectItem} = props;

  const popup = `
  <div>
    <p><strong>Гармония здоровья</strong><br></p>
    <ul>
      <li><strong>Адрес:&nbsp;</strong>г. Красноярск , ул. Академика Вавилова, 1 стр. 39</li>
      <li><strong>Часы работы:&nbsp;</strong>9:00 - 22:00</li>
      <li><strong>Телефон:&nbsp;</strong>(391) 274-29-79</li>
    </ul>
  </div>`

  const placeMark = (price) => {
    return {
      properties: {
        iconContent: `<div class="icn_content">${price} ₽</div>`,
        balloonContentBody: popup,
        hintContent: 'Гармония здоровья',
        // balloonContent: 'Гармония здоровья',
        iconCaption: '157р.'
      },
      modules: ['geoObject.addon.balloon', 'geoObject.addon.hint']
    }
  }
  // let iconImage = iconLoc;

  // function setIcon(type) {
  //   switch (type) {
  //     case 'gz':
  //       return iconImage = iconGZ;
  //     case 'da':
  //       return iconImage = iconDA;
  //     default:
  //       return iconImage = iconLoc;
  //   }
  // }

  const mapState = {
    center: point,
    zoom: zoom,
    controls: ['zoomControl', 'fullscreenControl']
  };


  const onItemClick = (idMarker) => {
    setActiveMarker(idMarker)
    const activeItem = document.querySelector('.PopupMapCart__activeItem');
    activeItem.scrollIntoView({behavior: "smooth"})
  }

  const close = (event) => {
    if (event.target.closest('.PopupMapCart__close') || (!event.target.closest('.PopupMapCart__content'))) {
      return props.onClick()
    }
  }
  const cityTitle = retails[0].title.match(/^([а-яА-Я])*/)[0]

  return (
    <div className={"PopupMapCart" + (props.active ? " PopupMapCart_is-opened" : "")} onClick={close}>
      <div className="PopupMapCart__content">
        <div className="PopupMapCart__close">
          <SvgClose/>
        </div>
        <h1>Аптеки в г. {cityTitle}</h1>
        <div className='PopupMapCart__mainContainer'>

          <BlockWrapper classStyle='PopupMapCart__retails'>
            <ul>
              {
                retails.map((item) => {
                  return <li
                    className={'PopupMapCart__retailItem' + (item.guid === activeMarker ? ' PopupMapCart__activeItem' : '')}
                    key={item.guid}
                    onClick={() => {
                      setPoint(item.coordinates)
                      setZoom(17)
                      setActiveMarker(null)
                    }}
                  >
                    <div className='PopupMapCart__itemBlock'>
                      <span className='PopupMapCart__itemTitle'>{item.title}</span>
                      <span className='PopupMapCart__itemAddress'>{item.street} {item.buildNumber}</span>
                      <span className='PopupMapCart__textClock'>Часы работы:&nbsp;9:00 - 22:00</span>
                    </div>

                    <button className='PopupMapCart__button'
                            onClick={() => onSelectItem(item)}>Выбрать
                    </button>
                  </li>
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
                  preset: 'islands#invertedVioletClusterIcons',
                  groupByCoordinates: false,
                }}
              >
                {
                  retails.map(({coordinates, guid, price}) => (
                    <Placemark key={guid}
                               onClick={() => onItemClick(guid)}
                               {...placeMark(price)}
                               geometry={coordinates}
                               options={{
                                 // iconLayout: 'default#imageWithContent',
                                 // iconLayout: 'default#image',
                                 // iconImageHref: setIcon(type),
                                 // iconImageSize: [45, 61],
                                 // iconImageOffset: [-22, -61],
                                 preset: 'islands#redStretchyIcon',
                                 draggable: true,
                                 // iconColor: 'red'
                               }}
                    />
                  ))
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

export default PopupMapCart