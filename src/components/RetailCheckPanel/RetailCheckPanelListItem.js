import React, {useRef, useState} from "react";
import './RetailCheckPanel.scss'
import CheckboxOrange from "../UI/CheckboxOrange";
import iconLocation from "../../img/location.svg";
import iconClock from "../../img/clock-regular.svg";
import iconPhone from "../../img/phone-solid.svg";
import SvgCheck from "../UI/icons/SvgCheck";
import ProductListDropdown from "../UI/ProductListDropdown/ProductListDropdown";

const RetailCheckPanelListItem = props => {

  const [showDescription, setShowDescription] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const refDescription = useRef(null)

  const {
    guid = '',
    city = '',
    street = '',
    buildNumber = '',
    weekDayTime = '',
    phone = '',
    sum = '',
    product = ''
  } = props.item

  const {isChecked, onCheck} = props;

  const onCheckPanel = (e) => {
    if (!e.target.closest(`.${refDescription.current.className}`)) {
      onCheck()
    }
  }

  return (
    <div className='RetailCheckPanel'>
      <div className='RetailCheckPanel__wrapperOnClick'
           onClick={onCheckPanel}>
        <div className='RetailCheckPanel__checkbox RetailCheckPanel__block'>
          <CheckboxOrange check={isChecked}
                          onCheck={() => onCheck()}
                          id={guid}
                          name={'RetailCheckPanel'}
                          type={'radio'}
          />
        </div>
        <div className='RetailCheckPanel__content RetailCheckPanel__block'>
          <p className='RetailCheckPanel__name'>
            <img src={iconLocation} alt="Адрес"/> Адрес: <span>г. {city}, ул. {street}, {buildNumber}</span>
          </p>
          <p className='RetailCheckPanel__openHours'><img src={iconClock} alt="Часы работы"/>Часы
            работы: <span>{weekDayTime}</span>
          </p>
          <p className='RetailCheckPanel__tel'><img src={iconPhone} alt="Телефон"/>Контактный
            телефон: <span>{phone}</span>
          </p>
        </div>
        <div className='RetailCheckPanel__price'>
          <div>
            <p>Сумма: {sum} ₽</p>
            <div ref={refDescription} onClick={() => {
              setShowDropdown(!showDropdown)
              setShowDescription(!showDescription)
            }}
                 className='RetailCheckPanel__descriptionContainer'
            >{props.quantity && props.quantity}</div>
          </div>
          <div className={'RetailCheckPanel__check ' + (isChecked ? 'bounceInLeft' : '')}>
            <SvgCheck style={{color: 'green'}}/>
          </div>
        </div>
      </div>

      <ProductListDropdown list={product} active={showDropdown}/>
    </div>
  )
}

export default RetailCheckPanelListItem