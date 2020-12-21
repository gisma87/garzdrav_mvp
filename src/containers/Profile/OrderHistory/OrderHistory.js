import React, {useState} from "react";
import './OrderHistory.scss'
import BlockWrapper from "../../../components/BlockWrapper";
import OrderContent from "./OrderContent/OrderContent";
import Alert from "../../../components/UI/Alert/Alert";

const OrderHistory = props => {

  const [alertShow, setAlertShow] = useState(false)
  const [statusAlert, setStatusAlert] = useState('')

  let delay = 0;
  return (
    <>
      <BlockWrapper classStyle='OrderHistory'>
        <h2>История покупок</h2>
        {
          props.sales.map(item => {
            delay += .09
            return <OrderContent key={item.dateDocument} item={item} delay={delay}
                                 setRepeatInfo={(status) => {
                                   setStatusAlert(status)
                                   setAlertShow(true)
                                 }}/>
          })
        }

      </BlockWrapper>
      <Alert show={alertShow} onClose={() => setAlertShow(false)} title='Информируем: '>
        {
          statusAlert === 'executed' &&
          <p>Товары из вашего заказа имеющиеся в наличии в текущем городе добавлены в корзину</p>
        }
        {
          statusAlert === 'failure' &&
          <p>К сожалению выбранных товаров сейчас нет в наличии</p>
        }
      </Alert>
    </>
  )
}

export default OrderHistory