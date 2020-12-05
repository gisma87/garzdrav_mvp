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
          {this.props.data.map((item, id) => {
            return <li key={Math.random() + id} className='DropDownMenu__item'><a href="#">{item.title}</a></li>
          })}
        </ul>
      </div>
    )
  }
}

export default DropDownMenu