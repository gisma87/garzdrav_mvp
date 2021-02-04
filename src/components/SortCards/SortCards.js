import React, {useEffect, useState} from "react";
import './SortCards.scss'
import SvgAngleUpSolid from "../../img/SVGcomponents/SvgAngleUpSolid";
import SvgArrowLongRight from "../UI/icons/SvgArrowLongRight";

const SortCards = props => {

  const [dropdownShow, setDropdownShow] = useState(false)
  // const [method, setMethod] = useState(props.items[0].text)

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
      <button className="SortCards__button"
              onClick={() => setDropdownShow(!dropdownShow)}
      >{props.items.find(el => el.id.toString() === props.methodSort.toString()).text}
        <SvgAngleUpSolid className='SortCards__arrowIcon'/>
      </button>
      <div className="SortCards__dropdown">

        {
          props.items.map(item => {
            return <button key={item.id}
                           className="SortCards__item"
                           onClick={() => {
                             props.selectItem(item.id)
                             // setMethod(item.text)
                             setDropdownShow(false)
                           }}>
              {item.text}
            </button>
          })
        }

      </div>
    </div>
  )
}


export const sortItems = [
  {
    id: 0,
    text: <span style={{paddingLeft: 15}}> По популярности</span>
  },
  {
    id: 'TitleAscending',
    text: <span className='sortItems'><SvgArrowLongRight className='sortItems__down'/> По наименованию А - Я</span>
  },
  {
    id: 'TitleDescending',
    text: <span className='sortItems'><SvgArrowLongRight className='sortItems__up'/> По наименованию Я - А</span>
  },
  {
    id: 'PriceAscending',
    text: <span className='sortItems'><SvgArrowLongRight className='sortItems__down'/> Сначала дешевые</span>
  },
  {
    id: 'PriceDescending',
    text: <span className='sortItems'><SvgArrowLongRight className='sortItems__up'/> Сначала дорогие</span>
  }
];

export default SortCards