import React from "react";
import './LoaderTimer.scss'
import LoaderCircle from "../LoaderCircle/LoaderCircle";

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
            <LoaderCircle/>
          </>
        }
      </div>
    )
  }
}

export default LoaderTimer