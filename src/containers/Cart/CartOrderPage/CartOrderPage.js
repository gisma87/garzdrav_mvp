import React from "react";
import './CartOrderPage.scss'
import BlockWrapper from "../../../components/BlockWrapper";
import iconLocation from "../../../img/icon/location.svg";
import iconClock from "../../../img/icon/clock.svg";
import iconPhone from "../../../img/icon/phone.svg";

const CartOrderPage = props => {
  return (
    <>
      <BlockWrapper classStyle='CartOrderPage'>
        <h3 className='CartOrderPage__title'>Ваш заказ:</h3>
        <div className="CartOrderPage__addressAndPrice">
          <div className='CartOrderPage__addressContainer'>
            <p className='CartOrderPage__name'>
              <img src={iconLocation} alt="Адрес"/>
              Адрес:
              <span
                className='CartOrderPage__address'>г. {props.retail.city}, ул. {props.retail.street}, {props.retail.buildNumber}</span>
            </p>
            <p className='CartOrderPage__openHours'><img src={iconClock} alt="Часы работы"/>Часы
              работы: <span>{props.retail.weekDayTime}</span>
            </p>
            <p className='CartOrderPage__tel'><img src={iconPhone} alt="Телефон"/>Контактный
              телефон: <span>{props.retail.phone}</span>
            </p>
          </div>
          <p className="CartOrderPage__sum">{props.retail.sum} ₽</p>
        </div>


        <div className="CartOrderPage__listOrder">
          {
            props.retail.product.map((product, index) => {
              return <div className='CartOrderPage__productContainer' key={product.guid + index}>
                <p className='CartOrderPage__productTitle'>{product.product}</p>
                <p className='CartOrderPage__productCount'>{product.count}шт. * {product.priceRetail} ₽/шт.</p>
                <p className='CartOrderPage__price'>{product.priceRetail * product.count} ₽</p>
              </div>
            })
          }
        </div>
      </BlockWrapper>


    </>

  )
}

export default CartOrderPage