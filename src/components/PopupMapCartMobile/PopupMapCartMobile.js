import React, {useState} from "react";
import './PopupMapCartMobile.scss'
import {Clusterer, GeolocationControl, Map, Placemark, SearchControl, YMaps} from "react-yandex-maps";
import RetailItem from "../RetailItem";
import PopupWrapper from "../UI/PopupWrapper/PopupWrapper";

const PopupMapCartMobile = props => {

  const [activeMarker, setActiveMarker] = useState(null)
  const {retails, onSelectItem} = props;
  const activeItem = retails.findIndex(item => activeMarker === item.guid)

  const placeMark = (price, popupInfo, flag = false) => {
    return {
      properties: {
        iconContent: `<div class="icn_content ${flag ? 'colorRed' : ''}">${price} ₽</div>`,
        // balloonContentBody: popup(popupInfo),
        hintContent: `${popupInfo.title}`,
        // balloonContent: 'Гармония здоровья',
        // iconCaption: '157р.'
      },
      modules: ['geoObject.addon.balloon', 'geoObject.addon.hint']
    }
  }

  const mapState = {
    center: props.point,
    zoom: 11,
    controls: ['zoomControl', 'fullscreenControl']
  };

  return (

    <PopupWrapper onClick={props.onClick} active={props.active} classStyle='PopupMapCartMobile'>
      <h1>Аптеки в г. Красноярск</h1>
      <div className='PopupMapCartMobile__mainContainer'>

        <YMaps>
          <Map className='PopupMapCartMobile__mapContainer'
               state={mapState}
               modules={['control.ZoomControl', 'control.FullscreenControl', "templateLayoutFactory", "layout.ImageWithContent"]}
               onClick={() => {
                 setActiveMarker(null)
               }}
          >
            <Clusterer
              options={{
                preset: 'islands#invertedVioletClusterIcons',
                groupByCoordinates: false,
              }}
            >
              {
                retails.map(item => {
                  if ((typeof item.coordinates !== 'object') || item.coordinates.length < 1) return null;
                  const {coordinates, guid, sum, brand, city, street, buildNumber, weekDayTime, phone} = item;
                  const popup = {
                    title: brand,
                    address: `г. ${city},  ${street} ${buildNumber}`,
                    clock: weekDayTime,
                    tel: phone
                  }
                  const notFullItems = () => item.product.length < props.cartLength
                  return (
                    <Placemark key={guid}
                               onClick={() => setActiveMarker(guid)}
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

      <div className='PopupMapCartMobile__absoluteCardItem'>
        {activeItem >= 0 && <RetailItem
          retailItem={retails[activeItem]}
          notFullItems={retails[activeItem].product.length < props.cartLength}
          active={retails[activeItem].guid === activeMarker}
          buttonActive={props.activeRetail === retails[activeItem].guid}
          onSelectItem={() => onSelectItem(retails[activeItem].guid)}
          setMapSetting={() => {
            // setPoint(retails[activeItem].retail.coordinates)
            // setZoom(17)
            // setActiveMarker(null)
          }}
        />}
      </div>
    </PopupWrapper>


  )
}

export default PopupMapCartMobile