import React from "react";
import './Dropdown-item.css'

class DropdownItem extends React.Component {

  state = {
    showSubMenu: false
  }

  render() {
    const {blockText, blockTitle} = this.props
    return (
      <li className={'dropdown-menu' + (this.state.showSubMenu ? ' open' : '')}>
        <p className="dropdown-menu__title"
           onClick={() => this.setState({showSubMenu: !this.state.showSubMenu})}
        >
          {blockTitle}
        </p>
        {typeof (blockText) === 'object' ? blockText.map((item, index) => {
          return (
            <div className='dropdown-menu__item' key={index} >{item}</div>
          )
        }) : <div className='dropdown-menu__item'>{blockText}</div>}
      </li>
    )
  }
}

export default DropdownItem