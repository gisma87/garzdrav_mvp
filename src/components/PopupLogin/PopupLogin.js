import React, {useEffect, useRef, useState} from "react"
import './PopupLogin.scss'
import PopupWrapper from "../UI/PopupWrapper/PopupWrapper";
import InputMask from 'react-input-mask'
import {connect} from "react-redux";
import {authorizedByEmail, authorizedByPassOrSMS} from "../../actions";
import apiService from "../../service/ApiService";
import EyeButtonShow from "../UI/EyeButtonShow/EyeButtonShow";

const PopupLogin = props => {

  const [formValid, setFormValid] = useState(false)
  // eslint-disable-next-line
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [smsCodeOrPassword, setSmsCodeOrPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [valueInputs, setValueInputs] = useState(null)
  const inputPhone = useRef()
  const inputEmail = useRef()

  useEffect(() => {
    if (props.TOKEN) props.onClick();
    // eslint-disable-next-line
  }, [props.TOKEN])

  function printValue(event) {
    const target = event.target;
    setValueInputs((prev) => ({...prev, [target.id]: target.value}))
  }

  function resetErrorMessage(event) {
    const errorElement = event.target.closest('form').querySelector(`#error-${event.target.id}`)
    errorElement.textContent = ''
  }

  function showErrorMessage(event) {
    const target = event.target;
    const errorElement = target.closest('form').querySelector(`#error-${target.id}`)

    if (target.type === 'tel') {
      if (!validatePhone(target.value)) {
        errorElement.textContent = 'Некорректный телефон'
      } else {
        errorElement.textContent = ''
      }
    }

    if (target.type === 'email') {
      if (!emailIsValid(target.value)) {
        errorElement.textContent = 'Некорректный email'
      } else {
        errorElement.textContent = ''
      }
    }
  }

  function validateForm(event) {
    const form = event.target.closest('form');
    const inputs = Array.from(form.getElementsByTagName('input'));
    inputs.forEach(target => {
      const errorElement = target.closest('form').querySelector(`#error-${target.id}`)
      if (target.type === 'tel') {
        if (!validatePhone(target.value)) {
          errorElement.textContent = 'Некорректный телефон'
        } else {
          errorElement.textContent = ''
        }
      }

      if (target.type === 'email') {
        if (!emailIsValid(target.value)) {
          errorElement.textContent = 'Некорректный email'
        } else {
          errorElement.textContent = ''
        }
      }
    })
    validate()
  }

  function validate(event) {
    if (event) printValue(event);
    const valPhone = inputPhone.current.value.trim();
    const valEmail = inputEmail.current.value.trim();
    const validPhone = validatePhone(valPhone)
    const validEmail = emailIsValid(valEmail)
    if (validEmail) setEmail(valEmail);
    setFormValid((validPhone && validEmail))
    return (validPhone && validEmail)
  }

  function validatePhone(valPhone) {
    const regexp = valPhone.match(/\d+/g)
    let data = ''
    if (regexp instanceof Object) {
      data = regexp.length > 1 ? regexp.slice(1).join('') : regexp.join('')
    }
    if (data.length) {
      setPhone(data)
    }

    return Number.isInteger(+data) && String(data).length === 10
  }

  function emailIsValid(valEmail) {
    return /\S+@\S+\.\S+/.test(valEmail)
  }

  return (
    <PopupWrapper onClick={props.onClick} active={props.active} classStyle='PopupLogin'>
      <h3 className="PopupLogin__title">Войти или зарегистрироваться</h3>
      <form className="PopupLogin__form" name="new"
            onSubmit={(event) => event.preventDefault()}
      >
        <InputMask mask="+7\ (999)\ 999\ 99\ 99"
                   maskChar=" "
                   value={valueInputs?.['PopupLogin-contact'] ? valueInputs['PopupLogin-contact'] : ''}
                   onChange={validate}
                   onBlur={showErrorMessage}
                   onFocus={resetErrorMessage}
                   className="PopupLogin__input PopupLogin__input_type_name"
                   placeholder="Телефон"
                   required
                   type="tel"
                   name="PopupLogin-contact"
                   id="PopupLogin-contact"
                   ref={inputPhone}
        />
        <span id="error-PopupLogin-contact" className="PopupLogin__error-message"> </span>

        <input
          id="PopupLogin-email"
          type='email'
          name="PopupLogin-email"
          value={valueInputs?.['PopupLogin-email'] ? valueInputs['PopupLogin-email'] : ''}
          className="PopupLogin__input PopupLogin__input_type_link-url"
          placeholder="E-mail"
          onChange={validate}
          onBlur={showErrorMessage}
          onFocus={resetErrorMessage}
          ref={inputEmail}
        />
        <span id="error-PopupLogin-email" className="PopupLogin__error-message"> </span>

        <div className='PopupLogin__inputPasswordContainer'>
          <input
            type={showPassword ? "text" : "password"}
            name="PopupLogin-pwd"
            className="PopupLogin__input PopupLogin__input_type_link-url"
            placeholder="Код из email-сообщения"
            id="PopupLogin-pwd"
            onChange={(event) => {
              const input = event.target;
              setSmsCodeOrPassword(input.value.trim())
            }}
          />
          <div className='PopupLogin__eyeShowButton' onClick={() => setShowPassword(!showPassword)}><EyeButtonShow
            show={showPassword}/></div>
        </div>
        {props.error &&
        <span id="error-PopupLogin-pwd" className="PopupLogin__error-message">Неверный логин или пароль</span>}
        <div className='PopupLogin__buttonContainer'>
          <button
            type='button'
            // disabled={!formValid}
            // onClick={() => apiService.getSmsCode(phone)}
            onClick={(event) => {
              validateForm(event)
              if (formValid) {
                apiService.getEmailCode(email)
              }
            }}
            className={"PopupLogin__button " + (formValid ? "PopupLogin__button_active" : '')}>
            Получить код
          </button>
          <button type='submit'
            // disabled={!formValid && !smsCodeOrPassword}
                  className={"PopupLogin__button " + ((formValid && smsCodeOrPassword) ? "PopupLogin__button_active" : '')}
                  onClick={() => {
                    // props.authorizedByPassOrSMS(phone, smsCodeOrPassword)
                    if ((formValid && smsCodeOrPassword)) {
                      props.authorizedByEmail(email, smsCodeOrPassword)
                    }
                  }}
          >
            Войти
          </button>
        </div>
      </form>
    </PopupWrapper>
  )
}

const mapStateToProps = ({TOKEN, error}) => {
  return {TOKEN, error}
}

const mapDispatchToProps = (dispatch) => {
  return {
    authorizedByPassOrSMS: (phone, smsOrPass) => dispatch(authorizedByPassOrSMS(phone, smsOrPass)),
    authorizedByEmail: (email, code) => dispatch(authorizedByEmail(email, code))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupLogin)
