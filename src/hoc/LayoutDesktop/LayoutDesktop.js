import React from "react"
import classes from './LayoutDesktop.module.css'
import HeaderDesktop from "../../components/HeaderDesktop";
import FooterDesktop from "../../components/FooterDesktop";

const LayoutDesktop = props => {
  return (
    <div className={classes.Layout}>
      <HeaderDesktop/>
      <main>
        {props.children}
      </main>
      <FooterDesktop/>
    </div>
  )
}

export default LayoutDesktop