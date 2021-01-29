import React from "react";
import './LoaderTimer.scss'

class LoaderTimer extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <div className={'LoaderTimer' + (this.props.active ? ' LoaderTimer_active' : '')}>
        {
          this.props.active &&
          <>
            <p className="LoaderTimer__timer">{this.props.seconds}</p>
            <div className='LoaderTimer__holder'>
              <div className="LoaderTimer__preloader">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </>
        }
      </div>
    )
  }
}

export default LoaderTimer