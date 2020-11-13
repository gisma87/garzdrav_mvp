import React from "react"
import './PopupCities.scss'
import PopupWrapper from "../UI/PopupWrapper/PopupWrapper";

const PopupCities = props => {
  const {cities} = props

  const renderItems = (arr) => {
    return arr.map((item) => {
      return <div key={item.guid}>
        <li onClick={() => props.onSelectCity(item)}>{item.title}</li>
      </div>
    })
  }

  return (
    <PopupWrapper onClick={props.onClick} active={props.active} classStyle='PopupCities'>
      <h3 className="PopupCities__title">Список городов</h3>
      <ul className="PopupCities__form">
        {renderItems(cities)}
      </ul>
    </PopupWrapper>
  )
}

export default PopupCities