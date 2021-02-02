import React, {useState} from "react";
import './RetailCheckPanel.scss'
import iconLocation from "../../img/icon/location.svg"
import iconPhone from "../../img/icon/phone.svg"
import iconClock from "../../img/icon/clock.svg"
import ProductListDropdown from "../UI/ProductListDropdown/ProductListDropdown";

const RetailCheckPanel = (props) => {

  const [showDescription, setShowDescription] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const {
    city = '',
    street = '',
    buildNumber = '',
    weekDayTime = '',
    phone = '',
    sum = '',
    product = ''
  } = props.item

  const {onCheck, openPopupMap} = props;

  return (
    <div className='RetailCheckPanel'>
      <div className='RetailCheckPanel__mainContainer'>
        <div className='RetailCheckPanel__content RetailCheckPanel__block'>
          <p className='RetailCheckPanel__name'>
            <img src={iconLocation} alt="Адрес"/>
            Адрес:
            <span className='RetailCheckPanel__address'
                  onClick={openPopupMap}>г. {city}, ул. {street}, {buildNumber}</span>
          </p>
          <p className='RetailCheckPanel__openHours'><img src={iconClock} alt="Часы работы"/>Часы
            работы: <span>{weekDayTime}</span>
          </p>
          <p className='RetailCheckPanel__tel'><img src={iconPhone} alt="Телефон"/>Контактный
            телефон: <span>{phone}</span>
          </p>
        </div>
        <div className='RetailCheckPanel__priceContainer'>
          <div className='RetailCheckPanel__price'>
            <p>Сумма: {sum} ₽</p>
            <div onClick={() => {
              setShowDropdown(!showDropdown)
              setShowDescription(!showDescription)
            }}
                 className='RetailCheckPanel__descriptionContainer'
            >{props.quantity && props.quantity}</div>
          </div>
        </div>
        <div className="RetailCheckPanel__btnContainer">
          <button className="RetailCheckPanel__button" onClick={onCheck}>Выбрать эту аптеку</button>
        </div>
      </div>

      <ProductListDropdown list={product} active={showDropdown}/>
    </div>
  )
}
export default RetailCheckPanel