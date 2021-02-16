import React, {useEffect, useRef, useState} from "react";
import {withRouter} from 'react-router-dom'
import './OrderInternetContent.scss'
import SvgAngleUpSolid from "../../../../img/SVGcomponents/SvgAngleUpSolid";
import BlockWrapper from "../../../../components/BlockWrapper";
import apiService from "../../../../service/ApiService";
import ButtonRepeatOrder from "../../../../components/ButtonRepeatOrder/ButtonRepeatOrder";
import {setStatusRequestOrder} from "../../../../actions";
import {connect} from "react-redux";

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
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (props.statusRequestRepeatOrder === 'executed') {
      props.setRepeatInfo('executed')
      props.setStatusRequestOrder('')
    }
    if (props.statusRequestRepeatOrder === 'failure') {
      props.setRepeatInfo('failure')
      props.setStatusRequestOrder('')
    }
    // eslint-disable-next-line
  }, [props.statusRequestRepeatOrder])

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
            item.status === 'Принят' &&
            <button className='OrderInternetContent__cancel' onClick={props.cancelOrder}>
              Отменить Заказ
            </button>
          }
          <div
            className={'OrderInternetContent__iconContainer' + (contentDisabled ? ' OrderInternetContent__rotate' : '')}>
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
          {item.items.map(product => <BlockWrapper classStyle='OrderInternetContent__product'
                                                   key={product.productGuid}>
              <p className='OrderInternetContent__productTitle'
                 onClick={() => {
                   apiService.getProductInfo(product.productGuid, props.isCity.guid)
                     .then(_ => props.history.push(`/Card/${product.productGuid}`))
                     .catch(_ => props.setRepeatInfo('failure'))

                 }}
              >{product.productTitle}</p>
              <p className='OrderInternetContent__info'>{product.quantity} шт.</p>
            </BlockWrapper>
          )}
          <div className='OrderInternetContent__infoContainer'>
            <div className="OrderInternetContent__infoContent">
              <p className='OrderInternetContent__infoItem'>
                <span>{item.retail.brand}:</span>
                <span
                  className='OrderInternetContent__address'> {item.retail.city}. {item.retail.street} {item.retail.buildNumber}</span>
              </p>
              <p className='OrderInternetContent__infoItem OrderInternetContent__status'>Статус: <span
                className='OrderInternetContent__positive'>{item.status}</span></p>
            </div>
            <ButtonRepeatOrder item={item}/>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({statusRequestRepeatOrder}) => {
  return {statusRequestRepeatOrder}
}

const mapDispatchToProps = (dispatch) => {
  return {
    setStatusRequestOrder: (status) => dispatch(setStatusRequestOrder(status))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OrderInternetContent))