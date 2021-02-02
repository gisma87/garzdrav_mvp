import React, {useRef, useState} from "react";
import './RetailItem.scss'
import {useMediaQuery} from 'react-responsive'
import ProductListDropdown from "../UI/ProductListDropdown/ProductListDropdown";
import SvgAngleUpSolid from "../../img/SVGcomponents/SvgAngleUpSolid";

const RetailItem = (props) => {
  const {
    retailItem,
    notFullItems,
    active,
    onSelectItem,
    setMapSetting = () => {
    }
  } = props;

  const [showDescription, setShowDescription] = useState(false)
  const refDescription = useRef(null)

  const isMobile = useMediaQuery({query: '(max-width: 900px)'})

  return (
    <li
      className={'RetailItem' + ((active && !isMobile) ? ' RetailItem__activeItem' : '')}
      key={retailItem.guid}
      onClick={() => setMapSetting(retailItem.guid)}
    >
      <div className='RetailItem__retailItemContainer'>
        <div className='RetailItem__itemBlock'>
          <span className='RetailItem__itemTitle'>{retailItem.brand}</span>
          <span className='RetailItem__itemAddress'>{retailItem.street} {retailItem.buildNumber}</span>
          <span className='RetailItem__textClock'>Часы работы:&nbsp;{retailItem.weekDayTime}</span>
          <span className='RetailItem__textClock'>Телефон:&nbsp;{retailItem.phone}</span>
        </div>


        <div className='RetailItem__priceContainer'>
          <p>{retailItem.sum} ₽</p>
          <div ref={refDescription} onClick={() => setShowDescription(!showDescription)}
               className='RetailItem__descriptionContainer'
          >
            <span>{props.quantity && props.quantity}</span>
            <div className={'RetailItem__iconContainer' + (showDescription ? ' RetailItem__rotate' : '')}>
              <SvgAngleUpSolid className='RetailItem__arrowIcon'/>
            </div>
          </div>


          <button
            // className={'RetailItem__button ' + ((active && isMobile) ? 'RetailItem__buttonActive' : '')}
            className='RetailItem__button'
            onClick={onSelectItem}>
            {/*{(active && isMobile) ? 'Выбран' : 'Выбрать'}*/}
            Выбрать
          </button>
        </div>
      </div>
      {notFullItems && <p className='colorRed'>не все позиции в наличии</p>}
      {/*{*/}
      {/*  showDescription && isMobile &&*/}
      {/*  retailItem.product.map((item) => {*/}
      {/*    return (*/}
      {/*      <div className='RetailItem__incomplete' key={item.guid}>*/}
      {/*        <p className='RetailItem__incomplete-title'>{item.product}</p>*/}
      {/*        <p className='RetailCheckPanelIncomplete__count'><span>{item.count}</span> шт:</p>*/}
      {/*        <p className='RetailItem__incomplete-price'>{(item.priceRetail * item.count).toFixed(2)} ₽</p>*/}
      {/*      </div>*/}
      {/*    )*/}
      {/*  })*/}
      {/*}*/}

      {
        isMobile &&
        <ProductListDropdown list={retailItem.product} active={showDescription}/>
      }
    </li>
  )
}

export default RetailItem