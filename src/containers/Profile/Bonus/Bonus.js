import React from "react";
import './Bonus.scss'
import BlockWrapper from "../../../components/BlockWrapper";

const Bonus = props => {
  return (
    <BlockWrapper classStyle='Bonus'>
      <h4>Бонусы: </h4>
      <BlockWrapper classStyle='Bonus__item'>
        <p className='Bonus__itemTitle'>Бонусная карта</p>
        <p className='Bonus__info'>№ {props.userData.barcode}</p>

      </BlockWrapper>
      <BlockWrapper classStyle='Bonus__item'>
        <p className='Bonus__itemTitle'>Накоплено бонусов за всё время</p>
        <div className='Bonus__itemContent'>
          <p className='Bonus__info'>{props.userData.accumulationBalance}</p>
        </div>
      </BlockWrapper>
      <BlockWrapper classStyle='Bonus__item'>
        <p className='Bonus__itemTitle'>Текущий баланс</p>
        <div className='Bonus__itemContent'>
          <p className='Bonus__info'>
            {props.userData.currentBalance}
          </p>
        </div>
      </BlockWrapper>
      <BlockWrapper classStyle='Bonus__item'>
        <p className='Bonus__itemTitle'>Вместе с картой вы совершили покупок на общую сумму:</p>
        <p className='Bonus__info'> {props.userData.saleBalance} ₽</p>
      </BlockWrapper>


      <p className='Bonus__signature'>Подробную историю зачисления / списания бонусов можно посмотреть в
        истории ваших покупок</p>

    </BlockWrapper>
  )
}

export default Bonus