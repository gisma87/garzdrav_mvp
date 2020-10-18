import React from "react"
import './Button-burger-mobile.css'

class ButtonBurgerMobile extends React.Component {

  state = {
    showMenu: false
  };

  render() {
    return (
      <div className='burger__body'>
        <div className={'burger__span-container' + (this.state.showMenu ? ' active' : '')}
             onClick={() => this.setState({showMenu: !this.state.showMenu})}>
          <span/>
        </div>
        <div className={'menu-wrapper' + (this.state.showMenu ? ' active' : '')}
            onClick={event => {
              if(event.target.matches('.menu-wrapper')) {
                const {showMenu} = this.state
                this.setState({showMenu: !showMenu})
              }
            }}
        >
          <div className='menu'>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default ButtonBurgerMobile