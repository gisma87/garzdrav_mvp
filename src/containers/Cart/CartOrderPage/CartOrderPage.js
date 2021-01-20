import React, {useState} from "react";
import './CartOrderPage.scss'
import BlockWrapper from "../../../components/BlockWrapper";
import iconLocation from "../../../img/icon/location.svg";
import iconClock from "../../../img/icon/clock.svg";
import iconPhone from "../../../img/icon/phone.svg";

const CartOrderPage = props => {

  const [phone, setPhone] = useState(null)

  return (
    <div className='CartOrderPage'>
      <BlockWrapper classStyle='CartOrderPage__container'>
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

      <div className='CartOrderPage__buyPanel' style={props.isAuth ? {justifyContent: 'flex-end'} : {}}>
        {
          !props.isAuth &&
          <div className='CartOrderPage__authBlock'>
            <p className='CartOrderPage__authTitle'>Авторизуйтесь или подтвердите номер телефона:</p>
            <form className='CartOrderPage__form'
                  noValidate
                  onSubmit={(event) => {
                    event.preventDefault()
                  }}>
              <label className="CartOrderPage__element">
                <input name="phone"
                       id="phone"
                       type="tel"
                       className="CartOrderPage__input"
                       required
                       value={phone}
                       onChange={(e) => setPhone(e.target.value)}
                />
                <p className="CartOrderPage__label">Введите телефон</p>
                <span className="CartOrderPage__errorMessage">ошибка</span>
              </label>
              <button className='CartOrderPage__buttonSMS'>получить код</button>
            </form>
          </div>
        }
        <button className='CartOrderPage__buttonToBuy'>оформить заказ</button>
      </div>


    </div>

  )
}

export default CartOrderPage