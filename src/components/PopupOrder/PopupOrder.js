import React, {useState} from "react";
import './PopupOrder.scss'
import PopupWrapper from "../UI/PopupWrapper/PopupWrapper";

const PopupOrder = props => {

  const [formValid, setFormValid] = useState(false)
  const [buy, setBuy] = useState(false)
  const [showDescription, setShowDescription] = useState(false)

  const checkedItem = () => {
    return props.retails.find((item) => item.guid === props.checked)
  }

  const onSummitHandler = (event) => {
    event.preventDefault()
    setBuy(true)
    setFormValid(false)
    props.onSubmit()
  }

  return (
    <PopupWrapper onClick={props.onClick} active={props.active} classStyle='PopupOrder'>
      <h3 className="PopupOrder__title">{!buy ? 'Оформить заказ' : 'Заказ принят к исполнению'}</h3>

      <form className={"PopupOrder__form" + (buy ? ' PopupOrder__buyActive' : '')} name="PopupOrder__form"
            onSubmit={onSummitHandler}
            onChange={(event) => {
              const input = event.target;
              if (input.id === 'PopupOrder-contact') {
                setFormValid(input.checkValidity())
              }
            }}
      >
        <div className='PopupOrder__selectContainer'>
          <p className='PopupOrder__titleInput'>Забрать из аптеки</p>
          <select name="PopupOrder-retails"
                  id="PopupOrder-retails"
                  className="PopupOrder__select"
                  value={props.checked}
                  onChange={props.onChange}>
            {props.retails.map((item) => {
                return (
                  <option key={item.guid} value={item.guid}>
                    г. {item.city}, {item.street}, {item.buildNumber}
                  </option>
                )
              }
            )}
          </select>
        </div>
        <div className='PopupOrder__priceContainer'>
          <p>Сумма заказа: </p>
          <p className='PopupOrder__sum'>{checkedItem().sum} ₽</p>
        </div>

        {!props.isFullActiveRetail &&
        <div className='PopupOrder__alert'>
          <p>В этой аптеке можно купить <span
            onClick={() => setShowDescription(!showDescription)}>{props.quantity}</span></p>
          <p>Недостающие позиции будут удалены из текущего заказа, но останутся в корзине</p>
        </div>}

        {
          <div className={'PopupOrder__containerLists' + (showDescription ? ' PopupOrder__listShow' : '')}>
            {props.product.map((item) => {
              return (
                <div className='PopupOrder__productsList' key={item.guid}>
                  <p className='PopupOrder__titleProduct'>{item.product}</p>
                  <div className='PopupOrder__priceContainerProduct'>
                    <p className='PopupOrder__countProduct'><span>{item.count}</span> шт:</p>
                    <p className='PopupOrder__priceProduct'>{(item.priceRetail * item.count).toFixed(2)} ₽</p>
                  </div>
                </div>
              )
            })}
          </div>
        }

        <div className='PopupOrder__inputLabel'>
          <label htmlFor="PopupOrder-contact">
            <fieldset>
              <legend>Введите телефон</legend>
              <input
                onChange={props.onChangeInput}
                type="text"
                name="PopupOrder-contact"
                className="PopupOrder__input PopupOrder__input_type_name"
                placeholder="8-XXX-XXX-XXXX"
                required
                minLength="6"
                maxLength="30"
                id="PopupOrder-contact"
              />
              <span id="error-PopupOrder-contact" className="popup__error-message"/>
            </fieldset>
          </label>
        </div>

        <div className='PopupOrder__buttonContainer'>
          <button type='submit'
                  disabled={!formValid}
                  className={"PopupOrder__button " + (formValid ? "PopupOrder__button_active" : '')}
          >
            Заказать
          </button>
          {/*<button className={"PopupLogin__button " + (formValid ? "PopupLogin__button_active" : '')}>*/}
          {/*  Получить код*/}
          {/*</button>*/}
        </div>
        <p className='PopupOrder__confidentiality'>
          Нажимая кнопку "Заказать" Вы соглашаетесь с
          <a href={'/confidentiality/'} target="_blank">политикой конфиденциальности Компании</a>
        </p>
      </form>

      <div className={'PopupOrder__buyTrue' + (!buy ? ' PopupOrder__buyActive' : '')}>

        <div className='PopupOrder__buyTrueContent'>
          <p>Ваш заказ N-XXX-XXX-XXX принят к исполнению.</p>
          <p>Об изменении статуса заказа будет сообщено по СМС</p>
        </div>
        <button type='button'
                className={"PopupOrder__button PopupOrder__button_active"}
                onClick={() => {
                  props.onClick()
                  setTimeout(() => setBuy(false), 2000)
                }}
        >
          ОК
        </button>
      </div>
    </PopupWrapper>
  )
}

export default PopupOrder