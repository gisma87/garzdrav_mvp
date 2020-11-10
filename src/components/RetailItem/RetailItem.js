import React from "react";
import './RetailItem.scss'

const RetailItem = (props) => {
  const {
    retails, // массив аптек
    buttonActive,
    onSelectItem,
    activeMarker,
    setMapSetting
  } = props;

  return (
    <ul className='RetailItem'>
      {
        retails.map(({retail, items, sum}) => {
          const notFullItems = () => items.length < 3
          return <li
            className={'RetailItem__retailItem' + (retail.guid === activeMarker ? ' RetailItem__activeItem' : '')}
            key={retail.guid}
            onClick={setMapSetting(retail.coordinates)}
          >
            <div className='RetailItem__retailItemContainer'>
              <div className='RetailItem__itemBlock'>
                <span className='RetailItem__itemTitle'>{retail.title}</span>
                <span className='RetailItem__itemAddress'>{retail.street} {retail.buildNumber}</span>
                <span className='RetailItem__textClock'>Часы работы:&nbsp;{retail.clock}</span>
              </div>

              <button
                className={'RetailItem__button ' + (buttonActive(retail.guid) ? 'RetailItem__buttonActive' : '')}
                onClick={() => onSelectItem(retail.guid)}>
                {buttonActive(retail.guid) ? 'Выбран' : 'Выбрать'}
              </button>
            </div>
            {notFullItems() && <p className='colorRed'>не все позиции в наличии</p>}
          </li>
        })
      }
    </ul>
  )
}

export default RetailItem