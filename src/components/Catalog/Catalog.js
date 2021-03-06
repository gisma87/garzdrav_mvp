import React, {useState} from "react";
import './Catalog.scss'
import Backdrop from "../UI/Backdrop/Backdrop";
import Burger from "../UI/Burger/Burger";
import {Link, NavLink} from "react-router-dom";
import {connect} from "react-redux";
import {setActiveCategory} from "../../actions";

const Catalog = props => {

  const [activeItem, setActiveItem] = useState(1)

  return (
    <>
      <div className={'Catalog' + (props.isActive ? ' Catalog__active' : '')}>
        <div className="Catalog__header">
          <p></p>
          <Burger isActive={props.isActive} onClick={props.onClick} theme='dark'/>
        </div>

        <div className="Catalog__container">
          <div className="Catalog__leftPanel">
            <ul>
              {props.data.map((item, id) => {
                return <li key={Math.random() + id}
                           className={"Catalog__leftPanelItem" + (id === activeItem ? ' Catalog__activeItem' : '')}
                           onClick={() => setActiveItem(id)}
                >
                  {item.title}

                </li>
              })}
            </ul>
          </div>
          <div className="Catalog__rightPanel">
            <ul className="Catalog__mainList">
              {props.data[activeItem].child.map((item, id) => {
                return <li key={Math.random() + id}
                           className="Catalog__rightPanelItem">
                  <Link to={'/catalog/' + item.guid + '/'}
                        onClick={() => {
                          props.setActiveCategory(item)
                          props.onClick()
                        }}>{item.title}</Link>
                  {item.child.length > 0 &&
                  <ul>
                    {item.child.map((itemChild, idChild) => {
                      return <li key={Math.random() + idChild}
                                 className="Catalog__subItem"
                                 onClick={() => {
                                   props.setActiveCategory(itemChild)
                                   props.onClick()
                                 }}
                      >
                        <NavLink to={'/catalog/' + itemChild.guid + '/'} className='Catalog__link Catalog__hoverLink'>
                          <span>{itemChild.title}</span>
                        </NavLink>
                      </li>
                    })}
                  </ul>
                  }
                </li>
              })}
            </ul>
          </div>
        </div>


      </div>
      {props.isActive && <Backdrop onClick={props.onClick}/>}
    </>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveCategory: (categoryItem) => dispatch(setActiveCategory(categoryItem))
  }
}

export default connect(null, mapDispatchToProps)(Catalog)