import React from "react";
import {Link} from "react-router-dom";
import './DropDownMenu.scss'

type Props = {
    data: {
        title: string,
        path: string
    }[],
    isActive: boolean
}

const DropDownMenu: React.FC<Props> = props => {

    return (
        <div className={'DropDownMenu ' + (props.isActive ? 'DropDownMenu__active' : '')}>
            <ul className='DropDownMenu__itemContainer'>
                {props.data.map((item, id) => {
                    return (<li key={id} className='DropDownMenu__item'><Link to={item.path}>{item.title}</Link></li>)
                })}
            </ul>
        </div>
    )
}


export default DropDownMenu