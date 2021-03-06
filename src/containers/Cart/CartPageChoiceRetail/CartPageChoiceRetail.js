import React from "react";
import {useMediaQuery} from "react-responsive";
import RetailItem from "../../../components/RetailItem";
import BlockWrapper from "../../../components/BlockWrapper";
import RetailCheckPanel from "../../../components/RetailCheckPanel";
import PopupMapCart from "../../../components/PopupMapCart";
import PopupMapCartMobile from "../../../components/PopupMapCartMobile/PopupMapCartMobile";
import ErrorBoundary from "../../../components/ErrorBoundary/ErrorBoundary";

const CartPageChoiceRetail = props => {
  const {
    calcQuantityProduct,
    isChecked, // (idRetail) => redux.store.selectedRetail === idRetail
    goToPageStageThree, // условный переход на 3-ю страницу
    showMap, // текущее значение popupMap: true - покажет карту, false - уберёт
    showDesktopPopupMap, // переключатель: true: PopupMap покажет, false: PopupCart не видно.
    cartItems, // список товаров для корзины из globalState, для который совершён успешный запрос подробной информации
    cart, // корзина из globalState
    onSelectRetail,
    retailsForMap,
    selectedRetail, // - выбранная аптека из globalState
  } = props.data;
  const {
    allCountFullProductRetails, // - аптеки со всем товаром и количеством
    notCompleteCountProductsRetails, // - аптеки со всем товаром но не полным количеством
    incompleteRetailItemState, // - аптеки - не все товары в наличии
  } = props.data.retails


  const isMobile = useMediaQuery({query: '(max-width: 900px)'})

  const isMobileList = <>
    <div className='CitiesMobile__menu Cart__menu'>
      <p onClick={() => showDesktopPopupMap(false)}
         className={'CitiesMobile__btn ' + (!showMap ? 'CitiesMobile__btn_active' : '')}>Список</p>
      <p onClick={() => showDesktopPopupMap(true)}
         className={'CitiesMobile__btn ' + (showMap ? 'CitiesMobile__btn_active' : '')}>Карта</p>
    </div>
    {
      (cartItems.length < cart.length) &&
      <p className='Cart__alert'>
        Некоторых товаров нет в вашем городе. Чтобы искать более результативно
        очистите корзину и осуществите ПОИСК заново по Вашему городу
      </p>
    }

    {
      allCountFullProductRetails.length > 0 &&
      <>
        <div className='Cart__blockTitle'><h2 className='Cart__titleChoice'>Всё в наличии:</h2></div>
        <BlockWrapper classStyle='Cart__blockMoreItems'>
          {
            allCountFullProductRetails.map((retail, index) => {
              return <RetailItem
                key={retail.guid + index + 21}
                retailItem={retail}
                quantity={calcQuantityProduct(retail.product)}
                active={isChecked(retail.guid)}
                onSelectItem={() => goToPageStageThree(retail.guid)}
              />
            })
          }
        </BlockWrapper>
      </>
    }
    {
      notCompleteCountProductsRetails.length > 0 &&
      <>
        <h2 className='Cart__titleChoice'>Не полное количество:</h2>
        <BlockWrapper classStyle='Cart__blockMoreItems'>
          {
            notCompleteCountProductsRetails.map((retail, index) => {
              return <RetailItem key={retail.guid + index + 22}
                                 retailItem={retail}
                                 quantity={calcQuantityProduct(retail.product)}
                                 active={isChecked(retail.guid)}
                                 onSelectItem={() => goToPageStageThree(retail.guid)}
              />
            })
          }
        </BlockWrapper>
      </>
    }
    {
      incompleteRetailItemState.length > 0 &&
      <>
        <h2 className='Cart__titleChoice'>Нет части товаров: </h2>

        <BlockWrapper classStyle='Cart__blockMoreItems'>
          {
            incompleteRetailItemState.map((retail, index) => {
              return <RetailItem key={retail.guid + index + 23}
                                 retailItem={retail}
                                 quantity={calcQuantityProduct(retail.product)}
                                 active={isChecked(retail.guid)}
                                 onSelectItem={() => goToPageStageThree(retail.guid)}
              />
            })
          }
        </BlockWrapper>
      </>
    }
  </>
  const isDesktopList = <>
    <div className='Cart__buttonContainer'>
      <button className='Cart__menuButton Cart__menuButton_active'>Показать списком</button>
      <button className='Cart__menuButton' onClick={() => showDesktopPopupMap(true)}>Показать на карте</button>
    </div>

    {
      (cartItems.length < cart.length) &&
      <p className='Cart__alert'>
        Некоторых товаров нет в вашем городе. Чтобы искать более результативно
        очистите корзину и осуществите ПОИСК заново по Вашему городу
      </p>
    }

    {
      allCountFullProductRetails.length > 0 &&
      <>
        <div className='Cart__blockTitle'><h2 className='Cart__titleChoice'>Всё в наличии:</h2></div>
        <BlockWrapper classStyle='Cart__blockMoreItems'>
          {
            allCountFullProductRetails.map((retail, index) => {
              return <RetailCheckPanel
                key={retail.guid + index + 24}
                item={retail}
                quantity={calcQuantityProduct(retail.product)}
                onCheck={() => goToPageStageThree(retail.guid)}
                openPopupMap={() => {
                  onSelectRetail(retail.guid)
                  showDesktopPopupMap(true)
                }}
              />
            })
          }
        </BlockWrapper>
      </>
    }
    {
      notCompleteCountProductsRetails.length > 0 &&
      <>
        <h2 className='Cart__titleChoice'>Не полное количество:</h2>
        <BlockWrapper classStyle='Cart__blockMoreItems'>
          {
            notCompleteCountProductsRetails.map((retail, index) => {
              return <RetailCheckPanel
                key={retail.guid + index + 25}
                item={retail}
                quantity={calcQuantityProduct(retail.product)}
                onCheck={() => goToPageStageThree(retail.guid)}
                openPopupMap={() => {
                  onSelectRetail(retail.guid)
                  showDesktopPopupMap(true)
                }}
              />
            })
          }
        </BlockWrapper>
      </>
    }
    {
      incompleteRetailItemState.length > 0 &&
      <>
        <h2 className='Cart__titleChoice'>Нет части товаров: </h2>
        <BlockWrapper classStyle='Cart__blockMoreItems'>
          {
            incompleteRetailItemState.map((retail, index) => {
              return <RetailCheckPanel
                key={retail.guid + index + 26}
                item={retail}
                quantity={calcQuantityProduct(retail.product)}
                onCheck={() => goToPageStageThree(retail.guid)}
                openPopupMap={() => {
                  onSelectRetail(retail.guid)
                  showDesktopPopupMap(true)
                }}
              />
            })
          }
        </BlockWrapper>
      </>
    }
  </>
  const isDesktopMap = <PopupMapCart active={showMap}
                                     city={props.data.city}
                                     retails={retailsForMap()}
                                     activeRetail={selectedRetail}
                                     cartLength={cart.length}
                                     onClick={() => showDesktopPopupMap(false)}
                                     onSelectItem={(retailId) => {
                                       showDesktopPopupMap(false)
                                       goToPageStageThree(retailId)
                                     }}
  />
  const isMobileMap = <PopupMapCartMobile active={showMap}
                                          city={props.data.city}
                                          retails={retailsForMap()}
                                          activeRetail={selectedRetail}
                                          cartLength={cart.length}
                                          onClick={() => showDesktopPopupMap(false)}
                                          onSelectItem={(retailId) => {
                                            showDesktopPopupMap(false)
                                            goToPageStageThree(retailId)
                                          }}
                                          quantity={(retailProductList) => calcQuantityProduct(retailProductList)}
  />

  return (
    <section className='Cart__choiceRetail'>
      <ErrorBoundary>
        <h3 className='Cart__choiceRetailTitle'>Выберите аптеку, в которой хотите забрать заказ</h3>
        {isMobile && isMobileList}
        {isMobile && isMobileMap}
        {!isMobile && isDesktopList}
        {!isMobile && isDesktopMap}
      </ErrorBoundary>
    </section>
  )
}

export default CartPageChoiceRetail