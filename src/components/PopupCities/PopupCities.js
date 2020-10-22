import React, {useEffect, useState} from "react"
import './PopupCities.scss'
import SvgClose from "../UI/icons/SvgClose";
import ApiService from "../../service/apiService";

const apiService = new ApiService()

const PopupCities = props => {

  const [cities, setCities] = useState(null)

  useEffect(() => {
    const getCities = async () => {
      const res = await apiService.getCities()
      return await res
    }

    getCities()
      .then((data) => {
        console.log(data)
        setCities(data)
      })
  }, [])


  // const data = ['Красноярск', 'Новосибирск', 'Ачинск', 'Ещё город']

  const close = (event) => {
    if (event.target.closest('.popup__close') || (!event.target.closest('.popup__content'))) {
      return props.onClick()
    }
  }

  const renderItems = (arr) => {
    return cities.map((item) => {
      console.log(item)
      return <div key={item.guid}>
        <li onClick={() => props.onSelectCity(item)}>{item.title}</li>
      </div>
    })
  }

  if (!cities) {
    return <h1>LOADING...</h1>
  } else {

    return (
      <div className={"popup" + (props.active ? " popup_is-opened" : "")} onClick={close}>
        <div className="popup__content">
          <div className="popup__close">
            <SvgClose/>
          </div>
          <h3 className="popup__title">Список городов</h3>
          <ul className="popup__form">
            {/*{*/}
            {/*  cities.map((item) => {*/}
            {/*    console.log(item)*/}
            {/*    return <div key={item.guid}>*/}
            {/*      <li onClick={() => props.onSelectCity(item)}>{item.title}</li>*/}
            {/*    </div>*/}
            {/*  })*/}

            {/*}*/}

            {cities ? renderItems(cities) : <h1>LOADING...</h1>}
          </ul>
        </div>
      </div>
    )
  }
}

export default PopupCities