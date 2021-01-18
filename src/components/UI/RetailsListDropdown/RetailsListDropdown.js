import React, {useEffect, useRef, useState} from "react";
import './RetailsListDropdown.scss'

const RetailsListDropdown = props => {
  // props: acitve - showStatus, list - items, count

  const [styleContent, setStyleContent] = useState({})
  const content = useRef(null)
  const contentWrapper = useRef(null)

  useEffect(() => {
    animate()
  }, [props.active, props.count])

  function animate() {
    props.active
      ? setStyleContent({height: `${contentWrapper.current?.clientHeight + 15}px`})
      : setStyleContent({height: 0})
  }

  return (
    <div ref={content}
         style={styleContent}
         className={'RetailsListDropdown' + (!props.active ? ' RetailsListDropdown_contentDisabled' : '')}>
      <div ref={contentWrapper} className='RetailsListDropdown__contentDropdown'>
        <h3 className='RetailsListDropdown__title'>В наличии в аптеке:</h3>
        {
          props.list.map((item) => {
            return (
              <div className='RetailsListDropdown__item' key={item.guid}>
                <p className='RetailsListDropdown__titleItem'>ул. {item.street} {item.buildNumber}</p>
                <div className='RetailsListDropdown__priceContainer'>
                  <p className='RetailsListDropdown__count'><span>{props.count}</span> шт:</p>
                  <p
                    className='RetailsListDropdown__price'>{(item.priceRetail * props.count).toFixed(2)} ₽</p>
                </div>
              </div>

              // <div className='CartItem__dropdownItem' key={item.guid}>
              //   <p className='CartItem__titleDropdownItem'>ул. {item.street} {item.buildNumber}</p>
              //   <div className='CartItem__dropdownPriceContainer'>
              //     <p className='CartItem__dropdownCount'><span>{count}</span> шт:</p>
              //     <p className='CartItem__dropdownPrice'>{(item.priceRetail * count).toFixed(2)} ₽</p>
              //   </div>
              // </div>


            )
          })}
      </div>
    </div>
  )
}

export default RetailsListDropdown