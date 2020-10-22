import React, {useState} from "react";
import './RetailCheckPanel.scss'
import SvgCheck from "../UI/icons/SvgCheck";
import BlockWrapper from "../BlockWrapper";
import CheckboxOrange from "../UI/CheckboxOrange";

import iconLocation from "../../img/location.svg"
import iconPhone from "../../img/phone-solid.svg"
import iconClock from "../../img/clock-regular.svg"

const RetailCheckPanel = () => {
  const [checked, setChecked] = useState(true)

  const onCheck = () => {
    setChecked(state => !state)
  }

  return (
    <BlockWrapper style='RetailCheckPanel'>
      <div className='RetailCheckPanel__wrapperOnClick' onClick={() => setChecked((state) => {
        return !state
      })}>
        <div className='RetailCheckPanel__checkbox RetailCheckPanel__block'>
          <CheckboxOrange check={checked} onCheck={onCheck} />
        </div>
        <div className='RetailCheckPanel__content RetailCheckPanel__block'>
          <p className='RetailCheckPanel__name'><img src={iconLocation} alt="Адрес"/> Адрес: <span>г. Красноярск, ул. Дмитрия Мартынова, 24</span>
          </p>
          <p className='RetailCheckPanel__openHours'><img src={iconClock} alt="Часы работы"/>Часы работы: <span>8:00 - 22:00</span>
          </p>
          <p className='RetailCheckPanel__tel'><img src={iconPhone} alt="Телефон"/>Контактный телефон: <span>(391) 218-18-90</span>
          </p>
        </div>
        <div className='RetailCheckPanel__price'>
          <p>Сумма: 580 ₽</p>
          <div className={'RetailCheckPanel__check ' + (checked ? 'bounceInLeft' : '')}>
            <SvgCheck style={{color: 'green'}}/>
          </div>
        </div>
      </div>
    </BlockWrapper>
  )
}

export default RetailCheckPanel