import React, {useEffect, useState} from "react";
import './SelectDropdown.scss'
import SvgAngleUpSolid from "../../../img/SVGcomponents/SvgAngleUpSolid";

// принимает на вход массив типа items = [{id, value}, ...] - id и value - любой примитив
// активный элемент - props.activeElement - это item из items
// выводит список value
// onClick по элементу - props.selectItem(id)
const SelectDropdown = props => {

  const [dropdownShow, setDropdownShow] = useState(false)
  const [activeElement, setActiveElement] = useState(props.activeElement)

  useEffect(() => {
    function close(e) {
      if (!e.target.closest('.SortCards')) {
        setDropdownShow(false)
      }
      document.removeEventListener('click', close)
    }

    if (dropdownShow) {
      document.addEventListener('click', close)
    }
  })

  return (
    <div className={"SortCards " + (dropdownShow ? 'SortCards_active' : '')}>
      <button className="SortCards__button" onClick={() => setDropdownShow(!dropdownShow)}>
        {activeElement?.value}<SvgAngleUpSolid className='SortCards__arrowIcon'/></button>
      <div className="SortCards__dropdown">

        {
          props.items?.length > 0
          && props.items.map((item, index) => {
            return <button key={index + Math.random()}
                           className="SortCards__item"
                           onClick={() => {
                             props.selectItem(item.id)
                             console.log('НАЗВАНИЕ: ', item.value)
                             setActiveElement(item)
                             setDropdownShow(false)
                           }}>
              {item.value}
            </button>
          })
        }

      </div>
    </div>
  )
}

export default SelectDropdown