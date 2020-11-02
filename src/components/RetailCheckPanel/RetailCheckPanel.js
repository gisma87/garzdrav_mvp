import React from "react";
import './RetailCheckPanel.scss'
import SvgCheck from "../UI/icons/SvgCheck";
import BlockWrapper from "../BlockWrapper";
import CheckboxOrange from "../UI/CheckboxOrange";

import iconLocation from "../../img/location.svg"
import iconPhone from "../../img/phone-solid.svg"
import iconClock from "../../img/clock-regular.svg"

const RetailCheckPanel = (props) => {

  const {retail, sum, items} = props.item
  const {list = 'main', isChecked, onCheck} = props;

  if (list === 'list') {
    return (
      <div className='RetailCheckPanel RetailCheckPanelList'>
        <div className='RetailCheckPanel__wrapperOnClick RetailCheckPanelList__wrapperOnClick'
             onClick={onCheck}>
          <div className='RetailCheckPanel__checkbox RetailCheckPanel__block'>
            <CheckboxOrange check={isChecked}
                            onCheck={() => onCheck()}
                            id={retail.guid}
                            name={'RetailCheckPanel'}
                            type={'radio'}
            />
          </div>
          <div className='RetailCheckPanel__content RetailCheckPanel__block RetailCheckPanelList__content'>
            <p className='RetailCheckPanel__name'><img src={iconLocation}
                                                       alt="Адрес"/> Адрес: <span>г. {retail.city}, ул. {retail.street}, {retail.buildNumber}</span>
            </p>
            <p className='RetailCheckPanel__openHours'><img src={iconClock} alt="Часы работы"/>Часы
              работы: <span>{retail.clock}</span>
            </p>
            <p className='RetailCheckPanel__tel'><img src={iconPhone} alt="Телефон"/>Контактный
              телефон: <span>{retail.tel}</span>
            </p>
          </div>
          <div className='RetailCheckPanel__price'>
            <p>Сумма: {sum} ₽</p>
            <div className={'RetailCheckPanel__check ' + (isChecked ? 'bounceInLeft' : '')}>
              <SvgCheck style={{color: 'green'}}/>
            </div>
          </div>
        </div>
      </div>
    )
  } else if (list === 'incomplete') {
    return (
      <div className='RetailCheckPanel RetailCheckPanelList'>
        <div className='RetailCheckPanel__wrapperOnClick RetailCheckPanelList__wrapperOnClick'
             onClick={onCheck}>
          <div className='RetailCheckPanel__checkbox RetailCheckPanel__block'>
            <CheckboxOrange check={isChecked}
                            onCheck={() => onCheck()}
                            id={retail.guid}
                            name={'RetailCheckPanel'}
                            type={'radio'}
            />
          </div>
          <div className='RetailCheckPanel__content RetailCheckPanel__block RetailCheckPanelList__content'>
            <p className='RetailCheckPanel__name'><img src={iconLocation}
                                                       alt="Адрес"/> Адрес: <span>г. {retail.city}, ул. {retail.street}, {retail.buildNumber}</span>
            </p>
            <p className='RetailCheckPanel__openHours'><img src={iconClock} alt="Часы работы"/>Часы
              работы: <span>{retail.clock}</span>
            </p>
            <p className='RetailCheckPanel__tel'><img src={iconPhone} alt="Телефон"/>Контактный
              телефон: <span>{retail.tel}</span>
            </p>
          </div>
          <div className='RetailCheckPanel__price'>
            <p>Сумма: {sum} ₽</p>
            <div className={'RetailCheckPanel__check ' + (isChecked ? 'bounceInLeft' : '')}>
              <SvgCheck style={{color: 'green'}}/>
            </div>
          </div>
        </div>

        {
          items.map((item) => {
            return (
              <div className='RetailCheckPanelIncomplete' key={item.id}>
                <p className='RetailCheckPanelIncomplete__title'>{item.title}</p>
                <p className='RetailCheckPanelIncomplete__price'><span>за 1шт:</span> {item.price} ₽</p>
              </div>
            )
          })
        }

      </div>
    )
  } else {
    return (
      <BlockWrapper classStyle='RetailCheckPanel'>
        <div className='RetailCheckPanel__wrapperOnClick' onClick={onCheck}>
          <div className='RetailCheckPanel__checkbox RetailCheckPanel__block'>
            <CheckboxOrange check={isChecked}
                            onCheck={onCheck}
                            id={retail.guid}
                            name={'RetailCheckPanel'}
                            type={'radio'}
            />
          </div>
          <div className='RetailCheckPanel__content RetailCheckPanel__block'>
            <p className='RetailCheckPanel__name'><img src={iconLocation}
                                                       alt="Адрес"/> Адрес: <span>г. {retail.city}, ул. {retail.street}, {retail.buildNumber}</span>
            </p>
            <p className='RetailCheckPanel__openHours'><img src={iconClock} alt="Часы работы"/>Часы
              работы: <span>{retail.clock}</span>
            </p>
            <p className='RetailCheckPanel__tel'><img src={iconPhone} alt="Телефон"/>Контактный
              телефон: <span>{retail.tel}</span>
            </p>
          </div>
          <div className='RetailCheckPanel__price'>
            <p>Сумма: {sum} ₽</p>
            <div className={'RetailCheckPanel__check ' + (isChecked ? 'bounceInLeft' : '')}>
              <SvgCheck style={{color: 'green'}}/>
            </div>
          </div>
        </div>
      </BlockWrapper>
    )
  }
}

export default RetailCheckPanel