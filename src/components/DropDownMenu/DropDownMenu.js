import React from "react";
import './DropDownMenu.scss'
import categoriesList from "../../testData/categoriesList";

class DropDownMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      hover: false
    }
  }

  render() {
    return (
      <div className='DropDownMenu'>
        <div onClick={() => this.setState({active: !this.state.active})}>
          {this.props.title}
        </div>
        <ul
          className={'DropDownMenu__itemContainer ' + (this.state.active ? 'DropDownMenu__itemContainer_active' : '')}>
          {categoriesList.map((item, id) => {
            return <li className='DropDownMenu__item' key={id}><a href="#">{item}</a></li>
          })}
        </ul>
      </div>
    )
  }
}

export default DropDownMenu