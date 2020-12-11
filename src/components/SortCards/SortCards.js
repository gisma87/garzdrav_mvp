import React, {useState} from "react";
import './SortCards.scss'
import SvgAngleUpSolid from "../../img/SVGcomponents/SvgAngleUpSolid";

const SortCards = props => {

  const [dropdownShow, setDropdownShow] = useState(false)

  return (
    <div className={"SortCards " + (dropdownShow ? 'SortCards_active' : '')}>
      <button className="SortCards__button"
              onClick={() => setDropdownShow(!dropdownShow)}
      >По популярности <SvgAngleUpSolid className='SortCards__arrowIcon'/></button>
      <div className="SortCards__dropdown">

        {
          props.items.map(item => {
            return <button key={item.id}
                           className="SortCards__item"
                           onClick={() => {
                             props.selectItem(item.id)
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

export default SortCards