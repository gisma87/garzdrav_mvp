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
              <p className='Bonus__itemTitle' style={props.activeCard ? noCard : {}}>Бонусная карта</p>
              <p className='Bonus__info'
                 style={props.activeCard ? noCard : {}}>№ {props.userData.cards[props.activeCard]?.barcode}</p>
            </BlockWrapper>
            <BlockWrapper classStyle='Bonus__item'>
              <p className='Bonus__itemTitle' style={props.activeCard ? noCard : {}}>Уровень карты</p>
              <div className='Bonus__itemContent'>
                <p className='Bonus__info'>{props.userData.cards[props.activeCard]?.level}</p>
              </div>
            </BlockWrapper>
            <BlockWrapper classStyle='Bonus__item'>
              <p className='Bonus__itemTitle' style={props.activeCard ? noCard : {}}>Текущий
                баланс</p>
              <div className='Bonus__itemContent'>
                <p className='Bonus__info Bonus__balance'>
                  {props.userData.cards[props.activeCard]?.currentBalance}
                </p>
              </div>
            </BlockWrapper>
            <BlockWrapper classStyle='Bonus__item'>
              <p className='Bonus__itemTitle' style={props.activeCard ? noCard : {}}>
                Вместе с картой вы совершили покупок на общую сумму:
              </p>
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
          <ul className='Bonus__cardsContainer'>
            {
              props.userData.cards.map((card, index) => {
                return (<li className='Bonus__cardItem'>
                  <button key={index}
                          onClick={() => {
                            props.setActiveCard(index)
                            window.scrollTo({
                              top: 0,
                              left: 0,
                              behavior: 'smooth'
                            });
                          }}
                          className='Bonus__btnSelectCard'><b>№ {card.barcode}</b> <span
                    className="Bonus__balanceText">Баланс: {card.currentBalance} ₽</span></button>
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