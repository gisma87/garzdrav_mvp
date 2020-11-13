import React from "react";
import './RetailItem.scss'
import {useMediaQuery} from 'react-responsive'

const RetailItem = (props) => {
  const {
    retailItem,
    notFullItems,
    active,
    buttonActive,
    onSelectItem,
    setMapSetting
  } = props;

  const isMobile = useMediaQuery({query: '(max-width: 800px)'})

  return (
    <li
      className={'RetailItem' + (active ? ' RetailItem__activeItem' : '')}
      key={retailItem.retail.guid}
      onClick={setMapSetting}
    >
      <div className='RetailItem__retailItemContainer'>
        <div className='RetailItem__itemBlock'>
          <span className='RetailItem__itemTitle'>{retailItem.retail.title}</span>
          <span className='RetailItem__itemAddress'>{retailItem.retail.street} {retailItem.retail.buildNumber}</span>
          <span className='RetailItem__textClock'>Часы работы:&nbsp;{retailItem.retail.clock}</span>
          <span className='RetailItem__textClock'>Телефон:&nbsp;{retailItem.retail.tel}</span>
        </div>


        <div className='RetailItem__priceContainer'>
          <p>{retailItem.sum} ₽</p>
          <button
            className={'RetailItem__button ' + (buttonActive ? 'RetailItem__buttonActive' : '')}
            onClick={onSelectItem}>
            {buttonActive ? 'Выбран' : 'Выбрать'}
          </button>
        </div>
      </div>
      {notFullItems && <p className='colorRed'>не все позиции в наличии</p>}
      {notFullItems && isMobile &&
      retailItem.items.map((item) => {
        return (
          <div className='RetailItem__incomplete' key={item.id}>
            <p className='RetailItem__incomplete-title'>{item.title}</p>
            <p className='RetailItem__incomplete-price'><span>за 1шт:</span> {item.price} ₽</p>
          </div>
        )
      })
      }

    </li>
  )
}

export default RetailItem