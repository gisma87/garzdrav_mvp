import React from "react";
import './Bonus.scss'
import BlockWrapper from "../../../components/BlockWrapper";

const Bonus = props => {

  const noCard = {marginBottom: 0}

  return (
    <BlockWrapper classStyle='Bonus'>
      <h4>Бонусы: </h4>
      {
        props.userData?.cards?.length
          ? <>
            <BlockWrapper classStyle='Bonus__item'>
              <p className='Bonus__itemTitle' style={props.activeCard ? {} : noCard}>Бонусная карта</p>
              <p className='Bonus__info'
                 style={props.activeCard ? {} : noCard}>№ {props.userData.cards[props.activeCard]?.barcode}</p>
            </BlockWrapper>
            <BlockWrapper classStyle='Bonus__item'>
              <p className='Bonus__itemTitle' style={props.activeCard ? {} : noCard}>Накоплено бонусов за всё время</p>
              <div className='Bonus__itemContent'>
                <p className='Bonus__info'>{props.userData.cards[props.activeCard]?.accumulationBalance}</p>
              </div>
            </BlockWrapper>
            <BlockWrapper classStyle='Bonus__item'>
              <p className='Bonus__itemTitle' style={props.activeCard ? {} : noCard}>Текущий
                баланс</p>
              <div className='Bonus__itemContent'>
                <p className='Bonus__info'>
                  {props.userData.cards[props.activeCard]?.currentBalance}
                </p>
              </div>
            </BlockWrapper>
            <BlockWrapper classStyle='Bonus__item'>
              <p className='Bonus__itemTitle' style={props.activeCard ? {} : noCard}>Вместе с
                картой
                вы
                совершили покупок на общую сумму:</p>
              {
                props.userData.cards[props.activeCard]?.saleBalance &&
                <p className='Bonus__info'> {props.userData.cards[props.activeCard]?.saleBalance} ₽</p>
              }
            </BlockWrapper>
            <p className='Bonus__signature'>Подробную историю зачисления / списания бонусов можно посмотреть в
              истории ваших покупок</p>
          </>
          : <p>У вас пока нет бонусной карты</p>
      }
      {
        props.userData.cards.length > 1 &&
        <div className='Bonus__cards'>
          <h4>Выберите бонусную карту: </h4>
          {
            props.userData.cards.map((card, index) => {
              return <button onClick={() => props.setActiveCard(index)}
                             className='Bonus__btnSelectCard'>№ {card.barcode} Баланс: {card.currentBalance}</button>
            })
          }
        </div>
      }
    </BlockWrapper>
  )
}

export default Bonus