import React from "react";
import './AskQuestion.scss'

const AskQuestion = () => {


  const setStatusText = (target) => {
    console.log(target.value)
  }


  return (
    <div className='AskQuestion wrapper'>

      <form onSubmit={(e) => {
        e.preventDefault()
        e.target.reset()
      }}
            onChange={
              (e) => {
                setStatusText(e.target)
              }
            }
      >
        <fieldset className='AskQuestion__container'>
          <legend>Задать вопрос</legend>
          <label htmlFor='AskQuestion-name' className='AskQuestion__label'>
            <p className='AskQuestion__labelTitle'>ФИО</p>
            <input type="text"
                   id='AskQuestion-name'
                   name='name'
                   className='AskQuestion__input'
                   placeholder='Представьтесь'
                   required
                   minLength="2"
                   maxLength="100"
            />
          </label>
          <label htmlFor='AskQuestion-contact' className='AskQuestion__label'>
            <p className='AskQuestion__labelTitle'>Ваши контактные данные</p>
            <input type="text"
                   id='AskQuestion-contact'
                   name='contact'
                   className='AskQuestion__input'
                   placeholder='Телефон и/или email'
                   required
                   minLength="2"
                   maxLength="100"
            />
          </label>
          <label htmlFor='AskQuestion-text' className='AskQuestion__label'>
            <p className='AskQuestion__labelTitle'>Ваш вопрос</p>
            <textarea
              id='AskQuestion-text'
              name='text'
              className='AskQuestion__input AskQuestion__textarea'
              placeholder='Текст сообщения'
              required
              minLength="5"

            />
          </label>
          <div className='AskQuestion__checkboxContainer'>
            <input type="checkbox" className='AskQuestion__checkbox' id='AskQuestion__checkbox'/>
            <label htmlFor="AskQuestion__checkbox">Я даю согласие на обработку персональных данных</label>
          </div>
          <button className='AskQuestion__buttonBuy'>Отправить</button>
        </fieldset>
      </form>

      <fieldset className='AskQuestion__faq'>
        <legend>Часто задаваемые вопросы</legend>
        <p className='AskQuestion__question'>Можно ли заказать доставку?</p>
        <p className='AskQuestion__answer'>
          Доставки нет.
          Вы можете забронировать ваш заказ, чтобы он уже был
          собран для вас и ожидал в выбранной аптеке
        </p>

        <p className='AskQuestion__question'>Можно ли оплатить товар по карте через интернет?</p>
        <p className='AskQuestion__answer'>
          Дистанционная торговля лекарственными средтсвами запрещена
        </p>

        <p className='AskQuestion__question'>Как долго хранится заказанный товар в аптеке?</p>
        <p className='AskQuestion__answer'>
          Сутки с момента заказа
        </p>

        <p className='AskQuestion__question'>Почему цена указыватеся "От" ?</p>
        <p className='AskQuestion__answer'>
          Цены на товары в разных аптеках отличаются. Мы показываем минимально возможную стоимость товара. Если хотите
          купить именно по этой цене, добавьте только этот товар в корзину и выберите именно ту аптеку, где он будет
          доступен по такой цене.
        </p>

        <p className='AskQuestion__question'>Как узнать что заказ принят?</p>
        <p className='AskQuestion__answer'>
          Информация о принято заказе поступит к вам по СМС. Также можно посмотреть статус заказа в личном кабинете.
        </p>

        <p className='AskQuestion__question'>Когда заказ готов к выдаче?</p>
        <p className='AskQuestion__answer'>
          Уведомление придёт к вам по СМС на номер, который был указан при оформлении заказа. Также статус заказа можно
          посмотреть в личном кабинете.
        </p>
      </fieldset>
    </div>
  )
}

export default AskQuestion