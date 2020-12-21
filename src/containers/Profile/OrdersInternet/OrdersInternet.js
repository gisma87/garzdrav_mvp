import React, {useState} from "react";
import './OrdersInternet.scss'
import apiService from "../../../service/ApiService";
import BlockWrapper from "../../../components/BlockWrapper";
import PopupCancelOrder from "../../../components/PopupCancelOrder/PopupCancelOrder";
import OrderInternetContent from "./OrderInternetContent/OrderInternetContent";
import {connect} from "react-redux";
import {getInternetSales, loadingFalse, loadingTrue, setError} from "../../../actions";
import Alert from "../../../components/UI/Alert/Alert";

const OrdersInternet = props => {
  const [showPopupCancel, setShowPopupCancel] = useState(false)
  const [cancelOrderGuid, setCancelOrderGuid] = useState(null)
  const [alertShow, setAlertShow] = useState(false)
  const [statusAlert, setStatusAlert] = useState('')

  let delay = 0;

  async function onCancel() {
    props.loadingTrue('onCancelOrder')
    try {
      const response = await apiService.cancelOrder(cancelOrderGuid, props.TOKEN.accessToken)
      if (response.status === 200) {
        console.log('Успешно удалён заказ ', cancelOrderGuid)
        props.getInternetSales()
      }
      props.loadingFalse()
    } catch (e) {
      props.setError(e)
    }
    setShowPopupCancel(false)
  }

  return (
    <>
      <BlockWrapper classStyle='OrderHistory'>
        <h2>Заказы: </h2>
        {props.internetSales.length > 0 &&
        props.internetSales.map(item => {
          delay += .09
          return <OrderInternetContent key={item.orderGuid} item={item} delay={delay}
                                       cancelOrder={() => {
                                         setCancelOrderGuid(item.orderGuid)
                                         setShowPopupCancel(true)
                                       }}
                                       setRepeatInfo={(status) => {
                                         setStatusAlert(status)
                                         setAlertShow(true)
                                       }}
                                       isCity={props.isCity}
          />
        })
        }

      </BlockWrapper>
      <PopupCancelOrder show={showPopupCancel}
                        onCancel={onCancel}
                        onClose={() => setShowPopupCancel(false)}/>

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

const mapStateToProps = ({TOKEN, internetSales,isCity}) => {
  return {TOKEN, internetSales, isCity}
}

const mapDispatchToProps = (dispatch) => {
  return {
    getInternetSales: () => dispatch(getInternetSales()),
    loadingTrue: (info) => dispatch(loadingTrue(info)),
    loadingFalse: () => dispatch(loadingFalse()),
    setError: (e) => dispatch(setError(e))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersInternet)