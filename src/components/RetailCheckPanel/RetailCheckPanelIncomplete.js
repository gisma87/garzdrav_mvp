import React, {useRef, useState} from "react";
import './RetailCheckPanel.scss'
import CheckboxOrange from "../UI/CheckboxOrange";
import iconLocation from "../../img/location.svg";
import iconClock from "../../img/clock-regular.svg";
import iconPhone from "../../img/phone-solid.svg";
import SvgCheck from "../UI/icons/SvgCheck";

const RetailCheckPanelIncomplete = props => {

  const [showDescription, setShowDescription] = useState(false)
  const refDescription = useRef(null)
  const [styleContent, setStyleContent] = useState({})
  const content = useRef(null)
  const contentWrapper = useRef(null)

  function animate() {
    content.current?.clientHeight
      ? setStyleContent({height: 0})
      : setStyleContent({height: `${contentWrapper.current?.clientHeight + 15}px`})
  }

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
    <div className='RetailCheckPanel RetailCheckPanelList'>
      <div className='RetailCheckPanel__wrapperOnClick RetailCheckPanelList__wrapperOnClick'
           onClick={onCheckPanel}>
        <div className='RetailCheckPanel__checkbox RetailCheckPanel__block'>
          <CheckboxOrange check={isChecked}
                          onCheck={() => onCheck()}
                          id={guid}
                          name={'RetailCheckPanel'}
                          type={'radio'}
          />
        </div>
        <div className='RetailCheckPanel__content RetailCheckPanel__block RetailCheckPanelList__content'>
          <p className='RetailCheckPanel__name'><img src={iconLocation}
                                                     alt="Адрес"/> Адрес: <span>г. {city}, ул. {street}, {buildNumber}</span>
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
              animate()
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

      <div ref={content}
           style={styleContent}
           className={'RetailCheckPanelIncomplete__dropdown' + (!showDescription ? ' RetailCheckPanelIncomplete__contentDisabled' : '')}>
        <div ref={contentWrapper} className='RetailCheckPanelIncomplete__contentDropdown'>
          {
            product.map((item) => {
              return (
                <div className='RetailCheckPanelIncomplete' key={item.guid}>
                  <p className='RetailCheckPanelIncomplete__title'>{item.product}</p>
                  <div className='RetailCheckPanelIncomplete__priceContainer'>
                    <p className='RetailCheckPanelIncomplete__count'><span>{item.count}</span> шт:</p>
                    <p
                      className='RetailCheckPanelIncomplete__price'>{(item.priceRetail * item.count).toFixed(2)} ₽</p>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>

    </div>
  )
}

export default RetailCheckPanelIncomplete