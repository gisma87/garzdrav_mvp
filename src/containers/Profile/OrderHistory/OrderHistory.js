import React from "react";
import './OrderHistory.scss'
import BlockWrapper from "../../../components/BlockWrapper";
import OrderContent from "./OrderContent/OrderContent";

const OrderHistory = props => {
  const orders = props.sales.filter(item => item.type === 'Реализация')
  let delay = 0;
  return (
    <BlockWrapper classStyle='OrderHistory'>
      <h2>История заказов</h2>
      {
        orders.map(item => {
          delay += .09
          return <OrderContent key={item.dateDocument} item={item} delay={delay}/>
        })
      }

    </BlockWrapper>
  )
}

export default OrderHistory