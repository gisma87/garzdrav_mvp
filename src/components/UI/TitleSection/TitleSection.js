import React from "react";
import './TitleSection.scss'
import SvgAngleRightSolid from "../../../img/SVGcomponents/SvgAngleRightSolid";
import {NavLink} from "react-router-dom";

const TitleSection = ({title, link}) => {
  return (
    <NavLink className='TitleSection' to={link}>
      {title}
      <span className="TitleSection__more">
            <SvgAngleRightSolid/>
          </span>
    </NavLink>
  )
}

export default TitleSection