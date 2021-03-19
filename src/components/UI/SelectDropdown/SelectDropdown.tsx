import React, {useEffect, useState} from "react";
import './SelectDropdown.scss'
import SvgAngleUpSolid from "../../../img/SVGcomponents/SvgAngleUpSolid";

type Item = {
    id: string,
    value: string
}

type Props = {
    activeElement: Item | null,
    items: Item[],
    selectItem(guid: string): void
}

const SelectDropdown: React.FC<Props> = props => {

    const [dropdownShow, setDropdownShow] = useState(false)

    useEffect(() => {
        function close(e: MouseEvent): void {
            if (!(e.target as HTMLDivElement).closest('.SortCards')) {
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
                {props.activeElement?.value}<SvgAngleUpSolid className='SortCards__arrowIcon'/></button>
            <div className="SortCards__dropdown">

                {
                    props.items?.length > 0
                    && props.items.map((item, index) => {
                        return <button key={index + Math.random()}
                                       className="SortCards__item"
                                       onClick={() => {
                                           props.selectItem(item.id)
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