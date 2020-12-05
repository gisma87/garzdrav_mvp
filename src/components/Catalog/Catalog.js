import React, {useState} from "react";
import './Catalog.scss'
import Backdrop from "../UI/Backdrop/Backdrop";
import Burger from "../UI/Burger/Burger";
import {useMediaQuery} from 'react-responsive'

const Catalog = props => {

  const [activeItem, setActiveItem] = useState(1)

  const isMobile = useMediaQuery({query: '(max-width: 1000px)'})

  return (
    <>
      <div className={'Catalog' + (props.isActive ? ' Catalog__active' : '')}>
        <div className="Catalog__header">
          <p> </p>
          <Burger isActive={props.isActive} onClick={props.onClick}/>
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
            <ul>
              {props.data[activeItem].child.map((item, id) => {
                return <li key={Math.random() + id}
                           className="Catalog__rightPanelItem">
                  <p>{item.title}</p>
                  {item.child.length > 0 &&
                  <ul>
                    {item.child.map((itemChild, idChild) => {
                      return <li key={Math.random() + idChild}
                                 className="Catalog__subItem">{itemChild.title}</li>
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

export default Catalog