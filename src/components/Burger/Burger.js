import React from "react"
import './Burger.css'

class Burger extends React.Component {

  render() {
    return (
      <div className='burger'>
        <div className={'burger__span' + (this.props.isActive ? ' active' : '')}>
          <span/>
        </div>
      </div>
    )
  }
}

export default Burger