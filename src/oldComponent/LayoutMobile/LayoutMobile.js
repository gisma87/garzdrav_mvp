import React from 'react';
import classes from './LayoutMobile.module.css'
import StickPanel from "../../components/StickPanel/Stick-panel";

const LayoutMobile = props => {
  return (
    <div className={classes.Layout}>
      <main>
        {props.children}
      </main>
      <StickPanel/>
    </div>
  )
}

export default LayoutMobile