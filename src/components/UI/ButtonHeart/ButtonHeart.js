import React from "react";
import SvgHeartSolid from "../icons/SvgHeartActive";
import SvgHeartIcon from "../icons/SvgHeartIcon";

const ButtonHeart = props => {

  if(props.active) {
    return <SvgHeartSolid/>
  } else {
    return <SvgHeartIcon/>
  }
}

export default ButtonHeart