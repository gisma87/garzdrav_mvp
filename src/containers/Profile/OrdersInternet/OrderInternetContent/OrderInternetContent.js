import React, {useEffect, useRef, useState} from "react";
import './OrderInternetContent.scss'
import SvgAngleUpSolid from "../../../../img/SVGcomponents/SvgAngleUpSolid";
import BlockWrapper from "../../../../components/BlockWrapper";

const OrderInternetContent = props => {

  const [contentDisabled, setContentDisabled] = useState(false)
  const [styleContent, setStyleContent] = useState({})
  const content = useRef(null)
  const contentWrapper = useRef(null)

  useEffect(() => {
    animate()
    const wrap = setTimeout(() => {
      if (props.item.status === 'Отменён') {
        animate()
        setContentDisabled(true)
      }
    }, 1100)
    return () => clearTimeout(wrap)
  }, [])

  const {item, delay} = props

  function animate() {
    content.current?.clientHeight
      ? setStyleContent({height: 0})
      : setStyleContent({height: `${contentWrapper.current?.clientHeight}px`})
  }

  return (
    <div className='OrderInternetContent__wrapper' style={{animationDelay: `${delay}s`}}>
      <div className='OrderInternetContent__headerItem' onClick={(e) => {
        if (!e.target.matches('.OrderInternetContent__cancel')) {
          animate()
          setContentDisabled(!contentDisabled)
        }

      }}>
        <p className='OrderInternetContent__title'>Заказ {item.number} от {item.dateCreated}</p>
        <div className='OrderInternetContent__rightHeader'>

          {
            contentDisabled &&
            <p className='OrderInternetContent__infoHeader'>
              <span className='OrderInternetContent__statusHeader'>{item.status}</span>
            </p>
          }

          {
            item.status === 'Создан' &&
            <button className='OrderInternetContent__cancel' onClick={props.cancelOrder}>
              Отменить Заказ
            </button>
          }
          <div className={'OrderInternetContent__iconContainer' + (contentDisabled ? ' OrderInternetContent__rotate' : '')}>
            <SvgAngleUpSolid className='OrderInternetContent__arrowIcon'/>
          </div>
        </div>
      </div>

      <div
        className={'OrderInternetContent__content' + (contentDisabled ? ' OrderInternetContent__contentDisabled' : '')}
        ref={content}
        style={styleContent}
      >
        <div className='OrderInternetContent__contentWrapperForAnimation' ref={contentWrapper}>
          {item.items.map((product, index) => <BlockWrapper classStyle='OrderInternetContent__product'
                                                            key={product.productGuid}>
              <p className='OrderInternetContent__productTitle'>{product.productTitle}</p>
              <p className='OrderInternetContent__info'>{product.quantity} шт.</p>
            </BlockWrapper>
          )}
          <div className='OrderInternetContent__infoContainer'>
            <p className='OrderInternetContent__infoItem'>
              <span>{item.retail.brand}:</span>
              <span style={{marginLeft: 10}}> {item.retail.city}. {item.retail.street} {item.retail.buildNumber}</span>
            </p>
            <p className='OrderInternetContent__infoItem'>Статус: <span
              className='OrderInternetContent__positive'>{item.status}</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderInternetContent