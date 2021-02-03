import React from "react";
import './Bonus.scss'
import BlockWrapper from "../../../components/BlockWrapper";

const Bonus = props => {
  return (
    <BlockWrapper classStyle='Bonus'>
      <h4>Бонусы: </h4>
      <BlockWrapper classStyle='Bonus__item'>
        <p className='Bonus__itemTitle' style={props.userData.barcode ? {} : {marginBottom: 0}}>Бонусная карта</p>
        {
          props.userData.barcode &&
          <p className='Bonus__info' style={props.userData.barcode ? {} : {marginBottom: 0}}>№ {props.userData.barcode}</p>
        }

      </BlockWrapper>
      <BlockWrapper classStyle='Bonus__item'>
        <p className='Bonus__itemTitle'  style={props.userData.accumulationBalance ? {} : {marginBottom: 0}}>Накоплено бонусов за всё время</p>
        <div className='Bonus__itemContent'>
          <p className='Bonus__info'>{props.userData.accumulationBalance}</p>
        </div>
      </BlockWrapper>
      <BlockWrapper classStyle='Bonus__item'>
        <p className='Bonus__itemTitle'  style={props.userData.currentBalance ? {} : {marginBottom: 0}}>Текущий баланс</p>
        <div className='Bonus__itemContent'>
          <p className='Bonus__info'>
            {props.userData.currentBalance}
          </p>
        </div>
      </BlockWrapper>
      <BlockWrapper classStyle='Bonus__item'>
        <p className='Bonus__itemTitle' style={props.userData.saleBalance ? {} : {marginBottom: 0}}>Вместе с картой вы совершили покупок на общую сумму:</p>
        {
          props.userData.saleBalance &&
          <p className='Bonus__info'> {props.userData.saleBalance} ₽</p>
        }
      </BlockWrapper>


      <p className='Bonus__signature'>Подробную историю зачисления / списания бонусов можно посмотреть в
        истории ваших покупок</p>

    </BlockWrapper>
  )
}

export default Bonus