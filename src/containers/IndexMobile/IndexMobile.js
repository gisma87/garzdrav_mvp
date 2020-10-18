import React from 'react';
import classes from './IndexMobile.module.css'
import SectionIndex from "../../components/SectionIndexMobile/Section-index";

const indexMobile = () => {
  return (
    <div className={classes.mainPage}>
      <SectionIndex/>
    </div>
  )
}

export default indexMobile