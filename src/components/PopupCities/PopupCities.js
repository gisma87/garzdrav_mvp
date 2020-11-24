import React, {useState} from "react"
import './PopupCities.scss'
import PopupWrapper from "../UI/PopupWrapper/PopupWrapper";
import Error from "../Error/Error";

const PopupCities = props => {
  const {isCity, regions} = props

  const [activeRegion, setActiveRegion] = useState('3a25bb73-7fe3-432f-839b-859da67a5347')

  const getItemActiveRegion = () => {
    return regions.find(item => item.regionGuid === activeRegion)
  }

  const renderItems = (arr) => {
    return arr.map((item) => {
      return <li key={item.guid}
                 onClick={() => props.onSelectCity(item.guid)}
                 className={item.guid === isCity.guid ? 'PopupCities__itemActive' : ''}
      >{item.title}</li>
    })
  }

  const renderRegions = (arr) => {
    return arr.map((item) => {
      return <li key={item.regionGuid}
                 onClick={() => setActiveRegion(item.regionGuid)}
                 className={item.regionGuid === isCity.regionGuid ? 'PopupCities__itemActive' : ''}
      >{item.regionTitle}</li>

    })
  }

  return (
    <PopupWrapper onClick={props.onClick} active={props.active} classStyle='PopupCities'>
      {!regions.length
        ? <Error/>
        : <div className='PopupCities__container'>
          <div className='PopupCities__column'>
            <h3 className="PopupCities__title">Регион</h3>
            <ul className="PopupCities__form">
              {renderRegions(regions)}
            </ul>
          </div>
          <div className='PopupCities__column'>
            <h3 className="PopupCities__title">Город</h3>
            <ul className="PopupCities__form">
              {renderItems(getItemActiveRegion().cities)}
            </ul>
          </div>
        </div>
      }
    </PopupWrapper>
  )
}

export default PopupCities