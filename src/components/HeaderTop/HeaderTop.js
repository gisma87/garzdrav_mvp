import React, {useState} from "react"
import './HeaderTop.scss'
import {Link, withRouter} from "react-router-dom";
import PopupCities from "../PopupCities";
import {setIsCity} from "../../actions";
import {connect} from "react-redux";

const HeaderTop = (props) => {
  const {cities, isCity, setIsCity, history} = props;
  const [popup, setPopup] = useState(false)

  return (
    <div className='HeaderTop'>
      <div className='wrapper'>
        <div className='HeaderTop__headItem' onClick={() => setPopup(true)}>
          <span>{isCity.title}</span>
        </div>
        <ul className='HeaderTop__headItems'>
          <li>
            <Link className='HeaderTop__link' to="/address/">Аптеки</Link>
          </li>
          <li>
            <Link className='HeaderTop__link' to='/'
                  onClick={(event) => {
                    event.preventDefault()
                    history.push('/')
                    window.scrollTo({
                      top: 780,
                      left: 0,
                      behavior: 'smooth'
                    });
                  }}
            >Как сделать заказ</Link>
          </li>
          <li>
            <Link className='HeaderTop__link' to="/promotions/">Акции</Link>
          </li>
        </ul>
        <Link to='/ask-question/' className='HeaderTop__headItem HeaderTop__link'>Задать вопрос</Link>
      </div>
      <PopupCities active={popup}
                   cities={cities}
                   onClick={() => setPopup(false)}
                   onSelectCity={(item) => {
                     setIsCity(item)
                     setPopup(false);
                   }}
      />
    </div>
  )
}

const mapStateToProps = ({cities, loading, error, isCity}) => {
  return {cities, loading, error, isCity}
}

const mapDispatchToProps = (dispatch) => {
  return {
    setIsCity: (item) => dispatch(setIsCity(item))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderTop))