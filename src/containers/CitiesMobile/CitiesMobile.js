import React, {useEffect, useState} from "react"
import {YMaps, Map, Placemark, Clusterer, GeolocationControl, SearchControl} from "react-yandex-maps";
import iconLoc from '../../img/test/map-pin.svg'
import iconGZ from '../../img/iconmap/gz.png'
import iconDA from '../../img/iconmap/da.png'
import './CitiesMobile.scss'
import points from "../../testData/points";
import {retailsCityLoaded, setIsCity} from "../../actions";
import {compose} from "../../utils";
import withStoreService from "../../hoc/withStoreService/withStoreService";
import {connect} from "react-redux";
import StoreService from "../../service/StoreService";
import BlockWrapper from "../../components/BlockWrapper";
import Select from "../../components/UI/Select/Select";

const CitiesMobile = props => {


  const [point, setPoint] = useState([56.010563, 92.852572])
  const [zoom, setZoom] = useState(11)
  const [activeMarker, setActiveMarker] = useState(null)
  const {cities, isCity, retailsCity} = props;
  const [view, setView] = useState(false)
  const storeService = new StoreService()

  const popup = `
  <div>
    <p><strong>Гармония здоровья</strong><br></p>
    <ul>
      <li><strong>Адрес:&nbsp;</strong>г. Красноярск , ул. Академика Вавилова, 1 стр. 39</li>
      <li><strong>Часы работы:&nbsp;</strong>9:00 - 22:00</li>
      <li><strong>Телефон:&nbsp;</strong>(391) 274-29-79</li>
    </ul>
  </div>`
  const placeMark = {
    properties: {
      balloonContentBody: popup,
      hintContent: 'Гармония здоровья',
      // balloonContent: 'Гармония здоровья',
      iconCaption: '157р.'
    },
    modules: ['geoObject.addon.balloon', 'geoObject.addon.hint']
  }
  let iconImage = iconLoc;

  function setIcon(type) {
    switch (type) {
      case 'gz':
        return iconImage = iconGZ;
      case 'da':
        return iconImage = iconDA;
      default:
        return iconImage = iconLoc;
    }
  }

  useEffect(() => {
    storeService.getRetailsCity(isCity.guid)
      .then((data) => props.retailsCityLoaded(data))
      .catch((error) => console.log('ОШИБКА в fetchRetailsCity ', error));
  }, [isCity.guid])

  const mapState = {
    center: point,
    zoom: zoom,
    controls: ['zoomControl', 'fullscreenControl']
  };

  const onItemClick = (idMarker) => {
    setActiveMarker(idMarker)
    const activeItem = document.querySelector('.Cities__acitveItem');
    let y = activeItem.getBoundingClientRect().top;
    const CitiesRetails = document.querySelector('.Cities__retails');
    const boxHeight = CitiesRetails.clientHeight;
    // activeItem.scrollIntoView({block: "center", behavior: "smooth"})

    CitiesRetails.scrollTo({
      top: y,
      left: 0,
      behavior: 'smooth'
    });
  }

  const selectChangeHandler = (event) => {
    const guid = event.target.value
    const city = cities.find(element => element.guid === guid)
    console.log(city);
    props.setIsCity(city)
  }

  return (
    <div className='CitiesMobile wrapper'>
      <header>
        <h1>Аптеки</h1>
        <p>Ваш город: </p>
        <Select
          value={isCity.guid}
          onChange={selectChangeHandler}
          options={cities.map(city => {
            return {text: city.title, value: city.guid}
          })
          }
        />
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
              points.map((item) => {
                return <li
                  className={'CitiesMobile__retailItem' + (item.guid === activeMarker ? ' Cities__acitveItem' : '')}
                  key={item.guid}
                  onClick={() => {
                    setPoint(item.coordinates)
                    setZoom(17)
                    setActiveMarker(null)
                  }}
                >
                  <span className='CitiesMobile__itemTitle'>{item.title}</span>
                  <span className='CitiesMobile__itemAddress'>{item.street} {item.buildNumber}</span>
                  <span className='CitiesMobile__textClock'>Часы работы:&nbsp;9:00 - 22:00</span>
                </li>
              })
            }
          </ul>
        </BlockWrapper>}

        {view && <YMaps>
          <Map className='CitiesMobile__mapContainer'
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
                points.map(({coordinates, guid, type}) => (
                  <Placemark key={guid}
                             // onClick={() => onItemClick(guid)}
                             {...placeMark}
                             geometry={coordinates}
                             options={{
                               // iconLayout: 'default#imageWithContent',
                               iconLayout: 'default#image',
                               iconImageHref: setIcon(type),
                               iconImageSize: [45, 61],
                               iconImageOffset: [-22, -61],
                             }}
                  />
                ))
              }
            </Clusterer>
            <GeolocationControl options={{float: 'left'}}/>
            <SearchControl options={{float: 'right'}}/>
          </Map>
        </YMaps>}

      </div>
    </div>
  )
}

const mapStateToProps = ({cities, isCity, retailsCity}) => {
  return {cities, isCity, retailsCity}
}

const mapDispatchToProps = (dispatch) => {
  return {
    setIsCity: (item) => dispatch(setIsCity(item)),
    retailsCityLoaded: (idCity) => {
      dispatch(retailsCityLoaded(idCity))
    }
  }
}

export default compose(
  withStoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(CitiesMobile)
