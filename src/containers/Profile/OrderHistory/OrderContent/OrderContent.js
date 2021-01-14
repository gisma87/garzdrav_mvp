import React, {useEffect, useRef, useState} from "react";
import {withRouter} from 'react-router-dom'
import './OrderContent.scss'
import SvgAngleUpSolid from "../../../../img/SVGcomponents/SvgAngleUpSolid";
import BlockWrapper from "../../../../components/BlockWrapper";
import {connect} from "react-redux";
import {repeatOrder, setStatusRequestOrder} from "../../../../actions";
import apiService from "../../../../service/ApiService";
import ButtonRepeatOrder from "../../../../components/ButtonRepeatOrder/ButtonRepeatOrder";

const OrderContent = props => {

  const [contentDisabled, setContentDisabled] = useState(false)
  const [styleContent, setStyleContent] = useState({})
  const content = useRef(null)
  const contentWrapper = useRef(null)

  useEffect(() => {
    animate()
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
  }, [props.statusRequestRepeatOrder])

  const {item, delay} = props

  function calcAmount(product) {
    const sum = (product.priceRetail - product.spendBonus - product.discount) * product.quantity
    return Math.round(sum * 100) / 100
  }

  function animate() {
    content.current.clientHeight
      ? setStyleContent({height: 0})
      : setStyleContent({height: `${contentWrapper.current.clientHeight}px`})
  }

  return (
    <div className='OrderContent__wrapper' style={{animationDelay: `${delay}s`}}>
      <div className='OrderContent__headerItem' onClick={() => {
        animate()
        setContentDisabled(!contentDisabled)
      }}>
        <p className='OrderContent__title'>Заказ от {item.dateDocument}</p>
        <div className='OrderContent__rightHeader'>
          {contentDisabled &&
          <p className='OrderContent__infoHeader'>
            {item.spendBonus > 0 ? <span className='OrderContent__spendBonusHeader'>- {item.spendBonus}</span> :
              <span> </span>}
            {item.accumulationBonus > 0 ?
              <span className='OrderContent__bonusHeader'>+ {item.accumulationBonus}</span> : <span> </span>}
            <span className='OrderContent__priceHeader'>{item.sumDocument} ₽</span>
          </p>}
          <div className={'OrderContent__iconContainer' + (contentDisabled ? ' OrderContent__rotate' : '')}>
            <SvgAngleUpSolid className='OrderContent__arrowIcon'/>
          </div>
        </div>
      </div>
      <div
        className={'OrderContent__content' + (contentDisabled ? ' OrderContent__contentDisabled' : '')}
        ref={content}
        style={styleContent}
      >
        <div className='OrderContent__contentWrapperForAnimation' ref={contentWrapper}>
          {
            item.items.map((product, index) => <BlockWrapper classStyle='OrderContent__product'
                                                             key={index + Math.random()}>
                <p className='OrderContent__productTitle' onClick={() => {
                  apiService.getProductInfo(product.product, props.isCity.guid)
                    .then(res => props.history.push(`/Cards/${product.product}`))
                    .catch(e => props.setRepeatInfo('failure'))

                }}>{product.title}</p>
                <p className='OrderContent__info'>Куплено: {product.quantity} шт по {product.priceRetail} ₽</p>
                <p className='OrderContent__info'>Начислено бонусов: <span
                  className='OrderContent__positive'>{product.accumulationBonus}</span></p>
                <p className='OrderContent__info'>Списано бонусов: <span
                  className={product.spendBonus > 0 ? 'OrderContent__negative' : ''}>{product.spendBonus}</span></p>
                {product.discount > 0 && <p className='OrderContent__info'>Скидка: {product.discount}</p>}
                <p
                  className='OrderContent__sumProduct'>{calcAmount(product)} ₽</p>
              </BlockWrapper>
            )
          }
          <div className='OrderContent__infoContainer'>
            <p className='OrderContent__infoItem'>
              <span>{item.retail.brand}: </span>
              <span style={{marginLeft: 10}}>{item.retail.city}. {item.retail.street} {item.retail.buildNumber}</span>
            </p>
            <p className='OrderContent__infoItem'>Начислено всего бонусов: <span
              className='OrderContent__positive'>{item.accumulationBonus}</span></p>
            <p className='OrderContent__infoItem'>Потрачено всего бонусов: <span
              className={item.spendBonus > 0 ? 'OrderContent__negative' : ''}>{item.spendBonus}</span></p>
            <div className='OrderContent__footer'>
              <p className='OrderContent__amount'>Итого: {item.sumDocument} ₽</p>
              <ButtonRepeatOrder item={item}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({statusRequestRepeatOrder, isCity}) => {
  return {statusRequestRepeatOrder, isCity}
}

const mapDispatchToProps = (dispatch) => {
  return {
    setStatusRequestOrder: (status) => dispatch(setStatusRequestOrder(status))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OrderContent))