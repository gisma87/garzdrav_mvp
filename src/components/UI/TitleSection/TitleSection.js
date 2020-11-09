import React from "react";
import './TitleSection.scss'
import SvgAngleRightSolid from "../../../img/SVGcomponents/SvgAngleRightSolid";
import {NavLink} from "react-router-dom";

const TitleSection = ({title, link, classStyle = '', size = '18px'}) => {
  return (
    <NavLink className={'TitleSection ' + classStyle} to={link}>
      {title}
      <span className="TitleSection__more">
            <SvgAngleRightSolid width={size} height={size}/>
          </span>
    </NavLink>
  )
}

export default TitleSection