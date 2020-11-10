import React, {useState} from "react";
import './PopupMapCart.scss'
// import iconLoc from "../../img/test/map-pin.svg";
// import iconGZ from "../../img/iconmap/gz.png";
// import iconDA from "../../img/iconmap/da.png";
import BlockWrapper from "../BlockWrapper";
import {Clusterer, GeolocationControl, Map, Placemark, SearchControl, YMaps} from "react-yandex-maps";
import SvgClose from "../UI/icons/SvgClose";
import RetailItem from "../RetailItem";

const PopupMapCart = props => {

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
  // const cityTitle = retails[0].title.match(/^([а-яА-Я])*/)[0]

  const buttonActive = (id) => props.activeRetail === id

  return (
    <div className={"PopupMapCart" + (props.active ? " PopupMapCart_is-opened" : "")} onClick={close}>
      <div className="PopupMapCart__content">
        <div className="PopupMapCart__close">
          <SvgClose/>
        </div>
        <h1>Аптеки в г. Красноярск</h1>
        <div className='PopupMapCart__mainContainer'>

          <BlockWrapper classStyle='PopupMapCart__retails'>
            {/*<RetailItem*/}
            {/*  retails={retails}*/}
            {/*  buttonActive={(id) => {*/}
            {/*    buttonActive(id)*/}
            {/*  }}*/}
            {/*  onSelectItem={(id) => {*/}
            {/*    onSelectItem(id)*/}
            {/*  }}*/}
            {/*  activeMarker={activeMarker}*/}
            {/*  setMapSetting = {(coordinates) => {*/}
            {/*    setPoint(coordinates)*/}
            {/*    setZoom(17)*/}
            {/*    setActiveMarker(null)*/}
            {/*  }}*/}
            {/*/>*/}


            <ul>
              {
                retails.map(({retail, items, sum}) => {
                  const notFullItems = () => items.length < 3
                  return <li
                    className={'PopupMapCart__retailItem' + (retail.guid === activeMarker ? ' PopupMapCart__activeItem' : '')}
                    key={retail.guid}
                    onClick={() => {
                      setPoint(retail.coordinates)
                      setZoom(17)
                      setActiveMarker(null)
                    }}
                  >
                    <div className='PopupMapCart__retailItemContainer'>
                      <div className='PopupMapCart__itemBlock'>
                        <span className='PopupMapCart__itemTitle'>{retail.title}</span>
                        <span className='PopupMapCart__itemAddress'>{retail.street} {retail.buildNumber}</span>
                        <span className='PopupMapCart__textClock'>Часы работы:&nbsp;{retail.clock}</span>
                      </div>

                      <button
                        className={'PopupMapCart__button ' + (buttonActive(retail.guid) ? 'PopupMapCart__buttonActive' : '')}
                        onClick={() => onSelectItem(retail.guid)}>
                        {buttonActive(retail.guid) ? 'Выбран' : 'Выбрать'}
                      </button>
                    </div>
                    {notFullItems() && <p className='colorRed'>не все позиции в наличии</p>}
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
                                   draggable: true,
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

export default PopupMapCart