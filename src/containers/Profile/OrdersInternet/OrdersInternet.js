import React, {useState} from "react";
import './OrdersInternet.scss'
import apiService from "../../../service/ApiService";
import BlockWrapper from "../../../components/BlockWrapper";
import PopupConfirm from "../../../components/PopupConfirm/PopupConfirm";
import OrderInternetContent from "./OrderInternetContent/OrderInternetContent";
import {connect} from "react-redux";
import {getInternetSales, loadingFalse, loadingTrue, refreshAuthentication, setError} from "../../../actions";
import Alert from "../../../components/UI/Alert/Alert";
import {service} from "../../../service/service";

const OrdersInternet = props => {
  const [showPopupCancel, setShowPopupCancel] = useState(false)
  const [cancelOrderGuid, setCancelOrderGuid] = useState(null)
  const [alertShow, setAlertShow] = useState(false)
  const [statusAlert, setStatusAlert] = useState('')

  let delay = 0;

  async function cancelOrder(accessToken = props.TOKEN.accessToken) {
    props.loadingTrue('onCancelOrder')
    try {
      const response = await apiService.cancelOrder(cancelOrderGuid, accessToken)
      if (response.status === 200) {
        console.log('Успешно удалён заказ ', cancelOrderGuid)
        props.getInternetSales()
      }
      props.loadingFalse()
    } catch (e) {
      props.setError(e)
      return Promise.reject('failed cancelOrder')
    }
    setShowPopupCancel(false)
  }

  function onCancel() {
    service.wrapperRefreshToken(cancelOrder, props.refreshAuthentication)
  }


  return (
    <>
      <BlockWrapper classStyle='OrderHistory'>
        <h2>Заказы: </h2>
        {props.internetSales.length
          ? props.internetSales.map(item => {
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
          : <span style={{marginLeft: 20}}>Пока ничего не заказано</span>
        }

      </BlockWrapper>
      <PopupConfirm show={showPopupCancel}
                    onConfirm={onCancel}
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

const mapStateToProps = ({TOKEN, internetSales, isCity}) => {
  return {TOKEN, internetSales, isCity}
}

const mapDispatchToProps = (dispatch) => {
  return {
    getInternetSales: () => dispatch(getInternetSales()),
    loadingTrue: (info) => dispatch(loadingTrue(info)),
    loadingFalse: () => dispatch(loadingFalse()),
    setError: (e) => dispatch(setError(e)),
    refreshAuthentication: () => dispatch(refreshAuthentication())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersInternet)