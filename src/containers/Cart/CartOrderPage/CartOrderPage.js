import React, {useState} from "react";
import './CartOrderPage.scss'
import BlockWrapper from "../../../components/BlockWrapper";
import iconLocation from "../../../img/icon/location.svg";
import iconClock from "../../../img/icon/clock.svg";
import iconPhone from "../../../img/icon/phone.svg";
import InputMask from "react-input-mask";
import apiService from "../../../service/ApiService";

const CartOrderPage = props => {

  const [phone, setPhone] = useState(null)
  const [smsCode, setSmsCode] = useState(null)
  const [formValid, setFormValid] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  function validate(event) {
    setErrorMessage('')
    const value = event.target.value.trim()
    const regexp = value.match(/\d+/g)
    let data = ''
    if (regexp instanceof Object) {
      data = regexp.length > 1 ? regexp.slice(1).join('') : regexp.join('')
    }
    if (data.length) {
      setPhone(data)
    }

    const result = Number.isInteger(+data) && String(data).length === 10
    setFormValid(result)
    return result
  }

  function submitOrder(event) {
    event.preventDefault()
    if (!formValid) {
      setErrorMessage('Неверно введён номер')
      return
    }

    if (formValid && !props.isAuth && !smsCode) {
      console.log('Введите СМС код для подтверждения номера')
      return
    }

    if (formValid && !props.isAuth && smsCode) {
      console.log('послали смс код')
      return
    }

    if (formValid && props.isAuth) {
      props.onSubmit()
      console.log('SUBMIT');
    }

  }

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
              <div>
                <label className="CartOrderPage__element">
                  <InputMask mask="+7\ (999)\ 999\ 99\ 99"
                             maskChar=" "
                             value={phone}
                             onChange={validate}
                             className="CartOrderPage__input"
                             placeholder=""
                             required
                             type="tel"
                             name="phone"
                             id="CartOrderPage-phone"
                  />
                  <p className="CartOrderPage__label">Введите телефон</p>
                  <span
                    className={'CartOrderPage__errorMessage' + (errorMessage.length ? ' CartOrderPage__errorMessage_visible' : '')}>{errorMessage}</span>
                </label>
                <label className="CartOrderPage__element">
                  <input className="CartOrderPage__input"
                         value={smsCode}
                         onChange={(e) => setSmsCode(e.target.value)}
                         required
                         type="text"
                         name="CartOrderPage-smsCode"
                         id="CartOrderPage-smsCode"
                  />
                  <p className="CartOrderPage__label">Код из СМС</p>
                  <span
                    className={'CartOrderPage__errorMessage' + (errorMessage.length ? ' CartOrderPage__errorMessage_visible' : '')}>{errorMessage}</span>
                </label>
              </div>

              <button className={'CartOrderPage__buttonSMS' + (formValid ? ' CartOrderPage__buttonSMS_enabled' : '')}
                      disabled={!formValid}
                      onClick={() => apiService.getSmsCode(phone)}
              >получить код
              </button>
            </form>
          </div>
        }
        <button className='CartOrderPage__buttonToBuy' onClick={submitOrder}>оформить заказ</button>
      </div>
    </div>
  )
}

export default CartOrderPage