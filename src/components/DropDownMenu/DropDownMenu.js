import React from "react";
import './DropDownMenu.scss'
// import categoriesList from "../../testData/categoriesList";

const DropDownMenu = props => {

  return (
    <div className='DropDownMenu'>
      <div onClick={props.onClick}>
        {props.title}
      </div>
      <ul
        className={'DropDownMenu__itemContainer ' + (props.isActive ? 'DropDownMenu__itemContainer_active' : '')}>
        {props.data.map((item, id) => {
          return <li key={Math.random() + id} className='DropDownMenu__item'>
            <a href="#">{item.title}</a>
            {props.child &&
            <ul className='DropDownMenu__dropList'>
              {item[props.child].map((itemChild, idChild) => {
                return <li key={Math.random() + idChild} className='DropDownMenu__item'>
                  <a href="#">{itemChild.title}</a>
                </li>
              })}
            </ul>
            }
          </li>
        })}
      </ul>
    </div>
  )
}


export default DropDownMenu