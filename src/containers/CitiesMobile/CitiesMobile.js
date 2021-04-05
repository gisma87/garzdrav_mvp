import React, {useEffect, useState} from "react"
import './CitiesMobile.scss'
import {clearCart, fetchRetailsCity, setIsCity} from "../../actions";
import {connect} from "react-redux";
import SelectDropdown from "../../components/UI/SelectDropdown/SelectDropdown";
import contactsLogo1 from "../../img/icon/contactsLocation.png";
import contactsLogo2 from "../../img/icon/contactsMail.png";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import PopupConfirm from "../../components/PopupConfirm/PopupConfirm";
import RetailsBlock from "../../components/RetailsBlock/RetailsBlock";

const CitiesMobile = props => {

  const {isCity} = props;
  const [showCitiesList, setShowCitiesList] = useState(false)

  const [popupConfirmActive, setPopupConfirmActive] = useState(false)
  const [itemGuid, setItemGuid] = useState(null)
  const [activeElementForDropDown, setActiveElementForDropDown] = useState(null)

  useEffect(() => {
    setActiveElementForDropDown(arrayCitiesForDropdown().find(el => el.id === isCity.guid))
    // eslint-disable-next-line
  }, [isCity])

  const confirmMessage = <><p>При смене города корзина будет очищена.</p>
    <p>Желаете сменить город?</p></>

  const arrayCitiesForDropdown = () => props.cities.map(el => ({id: el.guid, value: el.title}))

  return (
    <div className='CitiesMobile wrapper'>
      <ErrorBoundary>
        {
          (props.contacts && !showCitiesList) &&
          <div className='contactsMobile'>
            <h2 className='contactsMobile__title'>Головной офис</h2>
            <div className='contactsMobile__block'>
              <div className="contactsMobile__location contactsMobile__contactBlock">
                <img className='contactsMobile__logo' src={contactsLogo1} alt="логотип локации"/>
                <div className="contactsMobile__address">
                  <p className='contactsMobile__city'>г. Красноярск</p>
                  <p className='contactsMobile__street'>ул. Вавилова 1 стр. 39</p>
                  <p className='contactsMobile__build'>ТК "Атмосфера дома"</p>
                </div>
              </div>
              <div className="contactsMobile__mail contactsMobile__contactBlock">
                <img className='contactsMobile__logo' src={contactsLogo2} alt="логотип email"/>
                <div className="contactsMobile__contact">
                  <p className='contactsMobile__text-contact'>info@aptekalegko.ru</p>
                </div>
              </div>
            </div>
          </div>
        }

        <header>
          <h1>Аптеки</h1>
          <div className='CitiesMobile__dropdownCities'>
            <p>Город:</p>
            {
              arrayCitiesForDropdown()?.length > 0
              && <SelectDropdown items={arrayCitiesForDropdown()}
                                 activeElement={activeElementForDropDown}
                                 selectItem={(guid) => {
                                   setItemGuid(guid)
                                   setPopupConfirmActive(true)
                                 }}
              />
            }
          </div>
        </header>


        <RetailsBlock showCitiesList={showCitiesList} setShowCitiesList={(boolean) => setShowCitiesList(boolean)}/>
        <PopupConfirm show={popupConfirmActive}
                      title={'Внимание!'}
                      message={confirmMessage}
                      onConfirm={() => {
                        props.clearCart()
                        const itemCity = props.cities.find(el => el.guid === itemGuid)
                        props.setIsCity(itemCity)
                        setPopupConfirmActive(false)
                      }}
                      onClose={() => {
                        setPopupConfirmActive(false)
                      }}/>
      </ErrorBoundary>
    </div>
  )
}

const mapStateToProps = ({cities, isCity, retailsCity}) => {
  return {cities, isCity, retailsCity}
}

const mapDispatchToProps = (dispatch) => {
  return {
    setIsCity: (item) => dispatch(setIsCity(item)),
    fetchRetailsCity: () => dispatch(fetchRetailsCity()),
    clearCart: () => dispatch(clearCart())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CitiesMobile)
