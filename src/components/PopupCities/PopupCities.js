import React from "react"
import './PopupCities.scss'
import SvgClose from "../UI/icons/SvgClose";

const PopupCities = props => {
  const {cities} = props

  const close = (event) => {
    if (event.target.closest('.popup__close') || (!event.target.closest('.popup__content'))) {
      return props.onClick()
    }
  }

  const renderItems = (arr) => {
    return arr.map((item) => {
      return <div key={item.guid}>
        <li onClick={() => props.onSelectCity(item)}>{item.title}</li>
      </div>
    })
  }

  return (
    <div className={"popup" + (props.active ? " popup_is-opened" : "")} onClick={close}>
      <div className="popup__content">
        <div className="popup__close">
          <SvgClose/>
        </div>
        <h3 className="popup__title">Список городов</h3>
        <ul className="popup__form">
          {renderItems(cities)}
        </ul>
      </div>
    </div>
  )
}

export default PopupCities