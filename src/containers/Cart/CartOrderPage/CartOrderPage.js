import React, {useEffect, useRef, useState} from "react";
import './CartOrderPage.scss'
import BlockWrapper from "../../../components/BlockWrapper";
import iconLocation from "../../../img/icon/location.svg";
import iconClock from "../../../img/icon/clock.svg";
import iconPhone from "../../../img/icon/phone.svg";
import InputMask from "react-input-mask";
import apiService from "../../../service/ApiService";
import {service} from "../../../service/service";
import Loader from "../../../components/UI/Loader";
import {NavLink} from "react-router-dom";
import LoaderTimer from "../../../components/UI/LoaderTimer/LoaderTimer";
import EyeButtonShow from "../../../components/UI/EyeButtonShow/EyeButtonShow";
// eslint-disable-next-line
import {authorizedByEmail, authorizedByPassOrSMS} from "../../../actions";
import {connect} from "react-redux";

const CartOrderPage = props => {

  const [phone, setPhone] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [formValid, setFormValid] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [errorMessageCode, setErrorMessageCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isShowTimer, setIsShowTimer] = useState(false)
  const emailRef = useRef()

// для теста добавили email - он не нужен в будущем
  const [errorPhone, setErrorPhone] = useState(true)
  const [errorEmail, setErrorEmail] = useState(true)
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (props.OrderNumber.length) setLoading(false);
  }, [props.OrderNumber])

  useEffect(() => {
    setOrder({...props.retail})
    return () => props.delOrderNumber();
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (props.errorAuth) {
      if (+props.errorAuth?.data.code === 2) {
        setErrorMessageCode('Не верный СМС-код')
      }
      if (+props.errorAuth?.data.code === 3) {
        setErrorMessageCode('Превышены попытки ввода')
      }
    }
  }, [props.errorAuth])

  // function validate(event) {
  //   setErrorMessage('')
  //   const value = event.target.value.trim()
  //   const regexp = value.match(/\d+/g)
  //   let data = ''
  //   if (regexp instanceof Object) {
  //     data = regexp.length > 1 ? regexp.slice(1).join('') : regexp.join('')
  //   }
  //   if (data.length) {
  //     setPhone(data)
  //   }
  //
  //   const result = Number.isInteger(+data) && String(data).length === 10
  //   setFormValid(result)
  //   return result
  // }

  // для тестирования добавили поле email:
  function validatePhone(event) {
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
    setErrorPhone(!result)
    setFormValid((result && !errorEmail))
    return (result && !errorEmail)
  }

  function emailIsValid(email) {
    return /\S+@\S+\.\S+/.test(email)
  }

  function validEmail(event) {
    setErrorMessage('')
    const value = emailRef.current.value.trim()
    // const value = event.target.value.trim()

    setEmail(value)
    const isValid = emailIsValid(value)
    if (isValid) {
      setErrorEmail(false)
    } else {
      setErrorEmail(true)
    }
    setFormValid((!errorPhone && isValid))
    return (!errorPhone && isValid)
  }

  function submitOrder(event) {
    event.preventDefault()
    if (props.isAuth) {
      service.wrapperRefreshToken(props.onSubmit, props.refreshToken)
      return
    }

    if (!formValid && !props.isAuth) {
      setErrorMessage('Неверно введён номер')
      return
    }

    if (formValid && !props.isAuth && !smsCode) {
      setErrorMessageCode('Проверьте почту и введите код из Email')
      return
    }

    if (formValid && !props.isAuth && smsCode) {
      // props.authorizedBySMSorPassword(phone, smsCode, props.onSubmit)
      props.authorizedByEmail(email, smsCode, props.onSubmit)
    }
  }

  return (
    <div className='CartOrderPage'>
      {
        order &&
        <BlockWrapper classStyle='CartOrderPage__container'>
          <h3 className='CartOrderPage__title'>Ваш заказ:</h3>
          <div className="CartOrderPage__addressAndPrice">
            <div className='CartOrderPage__addressContainer'>
              <p className='CartOrderPage__name'>
                <img src={iconLocation} alt="Адрес"/>
                Адрес:
                <span
                  className='CartOrderPage__address'>г. {order.city}, ул. {order.street}, {order.buildNumber}</span>
              </p>
              <p className='CartOrderPage__openHours'><img src={iconClock} alt="Часы работы"/>Часы
                работы: <span>{order.weekDayTime}</span>
              </p>
              <p className='CartOrderPage__tel'><img src={iconPhone} alt="Телефон"/>Контактный
                телефон: <span>{order.phone}</span>
              </p>
            </div>
            <p className="CartOrderPage__sum">{order.sum} ₽</p>
          </div>

          <div className="CartOrderPage__listOrder">
            {
              order.product.map((product, index) => {
                return <div className='CartOrderPage__productContainer' key={product.guid + index + 3}>
                  <p className='CartOrderPage__productTitle'>{product.product}</p>
                  <p className='CartOrderPage__productCount'>{product.count}шт. * {product.priceRetail} ₽/шт.</p>
                  <p className='CartOrderPage__price'>{product.priceRetail * product.count} ₽</p>
                </div>
              })
            }
          </div>
        </BlockWrapper>
      }
      <div className='CartOrderPage__buyPanel'
           style={(props.isAuth && !props.OrderNumber.length) ? {justifyContent: 'flex-end'} : {}}>
        <Loader classStyle={loading ? 'Loader_is-opened' : ''}/>

        {
          !props.isAuth &&
          <>
            <div className='CartOrderPage__authBlock'>
              <p className='CartOrderPage__authTitle'>Авторизуйтесь или подтвердите номер телефона:</p>
              <form className='CartOrderPage__form'
                    noValidate
                    onSubmit={submitOrder}>
                <div>
                  <label className="CartOrderPage__element">
                    <InputMask mask="+7\ (999)\ 999\ 99\ 99"
                               maskChar=" "
                               value={phone}
                               onChange={validatePhone}
                               className="CartOrderPage__input"
                               placeholder=""
                               required
                               type="tel"
                               name="CartOrderPage-phone"
                               id="CartOrderPage-phone"
                    />
                    <p className="CartOrderPage__label">Введите телефон</p>
                    <span
                      className={'CartOrderPage__errorMessage' + (errorMessage.length ? ' CartOrderPage__errorMessage_visible' : '')}>{errorMessage}</span>
                  </label>
                  <label className="CartOrderPage__element">
                    <input
                      type='text'
                      value={email}
                      name="CartOrderPage-email"
                      id="CartOrderPage-email"
                      className="CartOrderPage__input"
                      onChange={validEmail}
                      ref={emailRef}
                      required
                    />
                    <p className="CartOrderPage__label">Введите Email</p>
                    <span
                      className={'CartOrderPage__errorMessage' + (errorMessage.length ? ' CartOrderPage__errorMessage_visible' : '')}>{errorMessage}</span>
                  </label>
                  <label className="CartOrderPage__element">
                    <input className="CartOrderPage__input"
                           value={smsCode}
                           onChange={(event) => {
                             const input = event.target
                             setSmsCode(input.value.trim())
                             setErrorMessageCode('')
                           }}
                           required
                           type={showPassword ? "text" : "password"}
                           name="CartOrderPage-smsCode"
                           id="CartOrderPage-smsCode"
                    />
                    <p className="CartOrderPage__label">Код из Email</p>
                    <span
                      className={'CartOrderPage__errorMessage CartOrderPage__errorMessage_code' + (errorMessageCode.length ? ' CartOrderPage__errorMessage_visible' : '')}>{errorMessageCode}</span>
                    <div className='CartOrderPage__eyeShowButton' onClick={() => setShowPassword(!showPassword)}>
                      <EyeButtonShow show={showPassword}/>
                    </div>
                  </label>
                </div>

                <div className='CartOrderPage__buttonContainer'>
                  <button
                    className={'CartOrderPage__buttonSMS' + ((formValid && !isShowTimer) ? ' CartOrderPage__buttonSMS_enabled' : '')}
                    disabled={!formValid || isShowTimer}
                    onClick={() => {
                      // apiService.getSmsCode(phone);
                      apiService.getEmailCode(email);
                      setIsShowTimer(true);
                    }}
                  >получить код
                  </button>
                  <LoaderTimer active={isShowTimer} seconds={60} hideTimer={() => setIsShowTimer(false)}/>
                </div>
              </form>
            </div>
          </>
        }

        {
          props.OrderNumber.length > 0
            ? <>
              <div className='CartOrderPage__authBlock'>
                <div className='CartOrderPage__form CartOrderPage__form_message'>
                  <p className='CartOrderPage__AfterBuy'>Ваш заказ N-{props.OrderNumber} принят к исполнению.</p>
                  <p className='CartOrderPage__AfterBuy'>Об изменении статуса заказа будет сообщено по Email.</p>
                  <p className='CartOrderPage__AfterBuy'>Статус заказа можно посмотреть в личном кабинете во вкладке
                    "Интернет заказы"</p>
                </div>
              </div>
              <NavLink className='CartOrderPage__buttonToBuy' style={{transform: 'scale(1)'}} to='/'>ОК</NavLink>
            </>
            : <button className='CartOrderPage__buttonToBuy'
                      onClick={submitOrder}
                      style={props.isAuth ? {transform: 'translateY(20px)'} : {}}
            >оформить заказ</button>
        }
      </div>
      {
        (props.userData && order && props.userData?.barcode && props.userData?.currentBalance) &&
        <p className='CartOrderPage__messageBonus'>
          На вашей карте&nbsp;<span className='CartOrderPage__bold'>№{props.userData?.barcode}</span>
          &nbsp;при оплате покупки доступно для списания &nbsp;
          <span
            className='CartOrderPage__bold'>{Math.min((Math.floor(((order.product.reduce((acc, product) => (product.priceRetail * product.count), 0)) / 2) * 100) / 100), (props.userData.currentBalance).toFixed(2))} Б.</span>
        </p>
      }
      <p className='CartOrderPage__messageBonus'>Не забудьте взять с собой &nbsp;<a href="http://kartalegko.ru/"
                                                                                    rel="noopener noreferrer"
                                                                                    target='_blank'>Бонусную карту
        Легко</a></p>
    </div>
  )
}

const mapStateToProps = ({userData}) => {
  return {userData}
}

const mapDispatchToProps = (dispatch) => {
  return {
    authorizedByEmail: (email, code, callback) => dispatch(authorizedByEmail(email, code, callback))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartOrderPage)