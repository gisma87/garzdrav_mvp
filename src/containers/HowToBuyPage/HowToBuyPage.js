import React from "react";
import './HowToBuyPage.scss'

const HowToBuyPage = () => {
  return (
    <section className='HowToBuyPage wrapper'>
      <div className='HowToBuyPage__titleBlock'>
        <h1 className='HowToBuyPage__title'>Инструкция по оформлению заказа</h1>
      </div>

      <div className='HowToBuyPage__item'>
        <div className='HowToBuyPage__itemTitleBlock'>
          <div className='HowToBuyPage__number'>1</div>
          <h3 className='HowToBuyPage__textTitle'>Зарегистрируйтесь или авторизуйтесь на сайте</h3>
        </div>
        <p className='HowToBuyPage__itemDescription'>После регистрации вы сможете совершать заказы и отслеживать их
          статус в личном кабинете</p>
      </div>

      <div className='HowToBuyPage__item'>
        <div className='HowToBuyPage__itemTitleBlock'>
          <div className='HowToBuyPage__number'>2</div>
          <h3 className='HowToBuyPage__textTitle'>Найдите нужные лекарства в поиске</h3>
        </div>
        <p className='HowToBuyPage__itemDescription'>Воспользуйтесь поиском: укажите название лекарства, бренда или
          действующего вещества.
          Примените сортировку по цене или алфавиту, чтобы проще выбрать нужный товар.</p>
      </div>

      <div className='HowToBuyPage__item'>
        <div className='HowToBuyPage__itemTitleBlock'>
          <div className='HowToBuyPage__number'>3</div>
          <h3 className='HowToBuyPage__textTitle'>Добавьте товары в корзину</h3>
        </div>
        <p className='HowToBuyPage__itemDescription'>Нажмите на значок "Корзины" на карточке товара и добавьте нужное
          количество.
          Затем перейдите в корзину и нажмите "Выбрать аптеку"</p>
      </div>

      <div className='HowToBuyPage__item'>
        <div className='HowToBuyPage__itemTitleBlock'>
          <div className='HowToBuyPage__number'>4</div>
          <h3 className='HowToBuyPage__textTitle'>Выберите аптеку</h3>
        </div>
        <p className='HowToBuyPage__itemDescription'>Выберите из предложенного списка аптеку, где планируете забрать
          заказ.</p>
      </div>

      <div className='HowToBuyPage__item'>
        <div className='HowToBuyPage__itemTitleBlock'>
          <div className='HowToBuyPage__number'>5</div>
          <h3 className='HowToBuyPage__textTitle'>Проверьте контактную информацию</h3>
        </div>
        <p className='HowToBuyPage__itemDescription'>
          Проверьте номер телефона и email, на email придёт сообщение со статусом заказа, а на телефон может позвонить
          оператор, если возникнут вопросы при формировании заказа. Затем нажмите на "Оформить заказ"
        </p>
      </div>

      <div className='HowToBuyPage__item'>
        <div className='HowToBuyPage__itemTitleBlock'>
          <div className='HowToBuyPage__number'>6</div>
          <h3 className='HowToBuyPage__textTitle'>Готово! Заберите ваш заказ!</h3>
        </div>
        <p className='HowToBuyPage__itemDescription'>
          По Email мы сообщим, когда можно прийти в аптеку за заказом. В аптеке назовите номер телефона или номер
          заказа, оплатите и заберите заказ. Не забудьте взять с собой рецепт, если в заказе есть рецептурный препарат.
        </p>
      </div>
    </section>
  )
}

export default HowToBuyPage