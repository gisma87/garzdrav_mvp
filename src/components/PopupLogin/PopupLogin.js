import React, {useState} from "react"
import './PopupLogin.scss'
import PopupWrapper from "../UI/PopupWrapper/PopupWrapper";
import InputMask from 'react-input-mask'

const PopupLogin = props => {

  const [formValid, setFormValid] = useState(false)
  const [phone, setPhone] = useState('')

  function validate(event) {
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


  return (
    <PopupWrapper onClick={props.onClick} active={props.active} classStyle='PopupLogin'>
      <h3 className="PopupLogin__title">Войти или зарегистрироваться</h3>
      <form className="PopupLogin__form" name="new"
            onSubmit={(event) => event.preventDefault()}
        // onChange={(event) => {
        //   const input = event.target;
        //   if (input.id === 'PopupLogin-contact') {
        //     setFormValid(validate(phone))
        //   }
        // }}
      >
        <InputMask mask="+7\ (999)\ 999\ 99\ 99"
                   maskChar=" "
                   value={phone}
                   onChange={validate}
                   className="PopupLogin__input PopupLogin__input_type_name"
                   placeholder="Телефон"
                   required
                   type="tel"
                   name="PopupLogin-contact"
                   id="PopupLogin-contact"
        />


        {/*<input*/}
        {/*  type="text"*/}
        {/*  name="PopupLogin-contact"*/}
        {/*  className="PopupLogin__input PopupLogin__input_type_name"*/}
        {/*  placeholder="Телефон или e-mail"*/}
        {/*  required*/}
        {/*  minLength="6"*/}
        {/*  maxLength="30"*/}
        {/*  id="PopupLogin-contact"*/}
        {/*/>*/}
        {/*<span id="error-newPlace" className="popup__error-message"/>*/}
        <input
          type="text"
          name="PopupLogin-pwd"
          className="PopupLogin__input PopupLogin__input_type_link-url"
          placeholder="Код или пароль"
          id="PopupLogin-pwd"
        />
        <span id="error-linkPlace" className="popup__error-message"/>

        <div className='PopupLogin__buttonContainer'>
          <button type='submit'
                  disabled={!formValid}
                  className={"PopupLogin__button " + (formValid ? "PopupLogin__button_active" : '')}
                  onClick={() => {
                    localStorage.setItem('isLogin', 'true')
                    props.onClick()
                  }}
          >
            Войти
          </button>
          <button disabled={!formValid}
                  className={"PopupLogin__button " + (formValid ? "PopupLogin__button_active" : '')}>
            Получить код
          </button>
        </div>
      </form>
    </PopupWrapper>
  )
}

export default PopupLogin