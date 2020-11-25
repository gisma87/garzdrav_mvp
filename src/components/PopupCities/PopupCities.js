import React, {useState} from "react"
import './PopupCities.scss'
import PopupWrapper from "../UI/PopupWrapper/PopupWrapper";
import Error from "../Error/Error";
import SearchForm from "../UI/SearchForm/SearchForm";

const PopupCities = props => {

  const [value, setValue] = useState('')
  const [filterCity, setFilterCity] = useState([])


  const {isCity, regions, cities} = props

  const [activeRegion, setActiveRegion] = useState('3a25bb73-7fe3-432f-839b-859da67a5347')

  const getItemActiveRegion = () => {
    return regions.find(item => item.regionGuid === activeRegion)
  }

  function onChangeHandler(e) {
    setValue(e.target.value)
    const arrIncludes = cities.filter(item => {
      if (e.target.value.trim() === '') {
        return false
      }
      return item.title.toUpperCase().startsWith(e.target.value.trim().toUpperCase())
    })
    setFilterCity(arrIncludes)
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

  function renderSearchResult() {
    if (filterCity.length) {
      return <ul className="PopupCities__form">{renderItems(filterCity)}</ul>
    }
    if (value.trim().length) {
      return 'Город не найден измените запрос или выберите город из списка вручную'
    }
    return null
  }

  return (
    <PopupWrapper onClick={props.onClick} active={props.active} classStyle='PopupCities'>
      <SearchForm formClass='SearchPanel'
                  onSubmit={(e) => {
                    e.preventDefault()
                  }}
                  idInput="searchCity"
                  placeholder='Поиск по городу'
                  onChange={onChangeHandler}
                  value={value}
      />


      {!regions.length
        ? <Error/>
        : <div className='PopupCities__container'>

          {value.trim().length ? renderSearchResult() :
            <>
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
            </>}
        </div>
      }
    </PopupWrapper>
  )
}

export default PopupCities