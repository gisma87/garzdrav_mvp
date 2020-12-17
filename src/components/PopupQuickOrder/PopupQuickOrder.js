import React, {useState} from "react";
import './PopupQuickOrder.scss'
import PopupWrapper from "../UI/PopupWrapper/PopupWrapper";

const PopupQuickOrder = props => {

  const [formValid, setFormValid] = useState(false)
  const [buy, setBuy] = useState(false)

  const checkedItem = () => {
    return props.productInfo.retails.find((item) => item.guid === props.activeRetailGuid)
  }

  const onSummitHandler = (event) => {
    event.preventDefault()
    setBuy(true)
    setFormValid(false)
    props.onSubmit()
  }

  return (
    <PopupWrapper onClick={props.onClose} active={props.active} classStyle='PopupQuickOrder'>
      <h3 className="PopupQuickOrder__title">{!buy ? 'Оформить заказ' : 'Заказ принят к исполнению'}</h3>

      <form className={"PopupQuickOrder__form" + (buy ? ' PopupQuickOrder__buyActive' : '')}
            name="PopupQuickOrder__form"
            noValidate
            onSubmit={onSummitHandler}
            onChange={(event) => {
              const input = event.target;
              if (input.id === 'PopupQuickOrder-contact') {
                setFormValid(input.checkValidity())
              }
            }}
      >
        <div className='PopupQuickOrder__selectContainer'>
          <p className='PopupQuickOrder__titleInput'>Забрать из аптеки</p>
          <select name="PopupQuickOrder-retails"
                  id="PopupQuickOrder-retails"
                  className="PopupQuickOrder__select"
                  value={props.activeRetailGuid || props.productInfo.retails[0]}
                  onChange={props.onChange}>
            {props.productInfo.retails.map((item, index) => {
                return (
                  <option key={index + item.guid} value={item.guid}>
                    г. {item.city}, {item.street}, {item.buildNumber}
                  </option>
                )
              }
            )}
          </select>
        </div>
        <div className='PopupQuickOrder__priceContainer'>
          <p>Сумма заказа: </p>
          <p className='PopupQuickOrder__sum'>{+(checkedItem()?.priceRetail * props.count).toFixed(2)} ₽</p>
          <div className="PopupQuickOrder__countButtons">
            <div className="PopupQuickOrder__countButtonMinus PopupQuickOrder__countButton"
                 onClick={() => {
                   if (props.count === 1) {
                     return this
                   } else props.setCount(props.count - 1)

                 }}>-
            </div>
            <input className="PopupQuickOrder__countInput" type="text" readOnly value={props.count}/>
            <div className="PopupQuickOrder__countButtonPlus PopupQuickOrder__countButton"
                 onClick={() => props.setCount(props.count + 1)}>+
            </div>
          </div>
        </div>

        <div className='PopupQuickOrder__inputLabel'>
          <label htmlFor="PopupQuickOrder-contact">
            <fieldset>
              <legend>Введите телефон</legend>
              <input
                onChange={props.onChangeInput}
                type="text"
                name="PopupQuickOrder-contact"
                className="PopupQuickOrder__input PopupQuickOrder__input_type_name"
                placeholder="8-XXX-XXX-XXXX"
                required
                minLength="6"
                maxLength="30"
                id="PopupQuickOrder-contact"
              />
              <span id="error-PopupQuickOrder-contact" className="popup__error-message"/>
            </fieldset>
          </label>
        </div>

        <div className='PopupQuickOrder__buttonContainer'>
          <button type='submit'
                  disabled={!formValid}
                  className={"PopupQuickOrder__button " + (formValid ? "PopupQuickOrder__button_active" : '')}
          >
            Заказать
          </button>
        </div>
        <p className='PopupQuickOrder__confidentiality'>
          Нажимая кнопку "Заказать" Вы соглашаетесь с
          <a href={'/confidentiality/'} rel="noopener noreferrer" target="_blank"> политикой конфиденциальности
            Компании</a>
        </p>
      </form>

      <div className={'PopupQuickOrder__buyTrue' + (!buy ? ' PopupQuickOrder__buyActive' : '')}>

        <div className='PopupQuickOrder__buyTrueContent'>
          <p>Ваш заказ N-XXX-XXX-XXX принят к исполнению.</p>
          <p>Об изменении статуса заказа будет сообщено по СМС</p>
        </div>
        <button type='button'
                className={"PopupQuickOrder__button PopupQuickOrder__button_active"}
                onClick={() => {
                  props.onClose()
                  setTimeout(() => setBuy(false), 2000)
                }}
        >
          ОК
        </button>
      </div>
    </PopupWrapper>
  )
}

export default PopupQuickOrder