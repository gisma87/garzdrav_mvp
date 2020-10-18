import React from "react"
import './PopupCities.scss'
import SvgClose from "../UI/icons/SvgClose";

const PopupCities = props => {
  const close = (event) => {
    if (event.target.closest('.popup__close') || (!event.target.closest('.popup__content'))) {
      return props.onClick()
    }
  }

  return (
    <div className={"popup" + (props.active ? " popup_is-opened" : "")} onClick={close}>
      <div className="popup__content">
        <div className="popup__close">
          <SvgClose/>
        </div>
        <h3 className="popup__title">Список городов</h3>
        <ul className="popup__form">
          <li>Красноярск</li>
          <li>Артёмовск</li>
          <li>Ачинск</li>
          <li>Богучаны</li>
          <li>Бородино</li>
          <li>Дивногорск</li>
          <li>Дудинка</li>
          <li>Енисейск</li>
          <li>Железногорск</li>
          <li>Заозёрный</li>
          <li>Зеленогорск</li>
          <li>Канск</li>
          <li>Лесосибирск</li>
          <li>Сосновоборск</li>
        </ul>
      </div>
    </div>
  )
}

export default PopupCities