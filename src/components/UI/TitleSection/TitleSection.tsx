import React from "react";
import './TitleSection.scss'
import SvgAngleRightSolid from "../../../img/SVGcomponents/SvgAngleRightSolid";
import {NavLink} from "react-router-dom";

type Props = {
    title: string,
    link: string,
    classStyle?: string,
    size?: string
}

const TitleSection: React.FC<Props> = ({title, link, classStyle = '', size = '18px'}) => {
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