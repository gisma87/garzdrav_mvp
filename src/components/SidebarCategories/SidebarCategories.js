import React from "react";
import './SidebarCategories.scss'
import categoriesList from "../../testData/categoriesList";

const SidebarCategories = ({styleName = ''}) => {
  return (
    <ul className={"SidebarCategories " + styleName}>
      {categoriesList.map((item, id) => {
        return <li key={id}><a href="#">{item}</a><i/></li>
      })}
    </ul>
  )
}

export default SidebarCategories