import React from "react";
import './Bonus.scss'
import BlockWrapper from "../../../components/BlockWrapper";

const Bonus = props => {

  const noCard = {marginBottom: 0}

  const cards = [...props.userData.cards]
  cards.sort((a, b) => a.currentBalance < b.currentBalance ? 1 : -1)

  return (
    <BlockWrapper classStyle='Bonus'>
      <h4>Бонусы: </h4>
      {
        cards?.length
          ? <>
            <BlockWrapper classStyle='Bonus__item'>
              <p className='Bonus__itemTitle' style={props.activeCard ? noCard : {}}>Бонусная карта</p>
              <p className='Bonus__info'
                 style={props.activeCard ? noCard : {}}>№ {cards[props.activeCard]?.barcode}</p>
            </BlockWrapper>
            <BlockWrapper classStyle='Bonus__item'>
              <p className='Bonus__itemTitle' style={props.activeCard ? noCard : {}}>Уровень карты</p>
              <div className='Bonus__itemContent'>
                <p className='Bonus__info'>{cards[props.activeCard]?.level}</p>
              </div>
            </BlockWrapper>
            <BlockWrapper classStyle='Bonus__item'>
              <p className='Bonus__itemTitle' style={props.activeCard ? noCard : {}}>Текущий
                баланс</p>
              <div className='Bonus__itemContent'>
                <p className='Bonus__info Bonus__balance'>
                  {cards[props.activeCard]?.currentBalance.toFixed(2)}
                </p>
              </div>
            </BlockWrapper>
            <BlockWrapper classStyle='Bonus__item'>
              <p className='Bonus__itemTitle' style={props.activeCard ? noCard : {}}>
                Вместе с картой вы совершили покупок на общую сумму:
              </p>
              {
                cards[props.activeCard]?.saleBalance &&
                <p className='Bonus__info'> {cards[props.activeCard]?.saleBalance.toFixed(2)} ₽</p>
              }
            </BlockWrapper>
            <p className='Bonus__signature'>Подробную историю зачисления / списания бонусов можно посмотреть в
              истории ваших покупок</p>
          </>
          : <p>У вас пока нет бонусной карты</p>
      }
      {
        cards.length > 1 &&
        <div className='Bonus__cards'>
          <h4>Выберите бонусную карту: </h4>
          <ul className='Bonus__cardsContainer'>
            {
              cards.map((card, index) => {
                return (<li key={index} className='Bonus__cardItem'>
                  <button onClick={() => {
                    props.setActiveCard(index)
                    window.scrollTo({
                      top: 0,
                      left: 0,
                      behavior: 'smooth'
                    });
                  }}
                          className='Bonus__btnSelectCard'><b>№ {card.barcode}</b> <span
                    className="Bonus__balanceText">Баланс: {card.currentBalance.toFixed(2)} ₽</span></button>
                </li>)
              })
            }
          </ul>
        </div>
      }
    </BlockWrapper>
  )
}

export default Bonus