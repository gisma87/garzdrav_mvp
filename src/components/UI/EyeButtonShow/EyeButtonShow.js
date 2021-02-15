import React from "react";
import './EyeButtonShow.scss';
import SvgEye from "./icons/SvgEye";
import SvgCloseEye from "./icons/SvgCloseEye";

const EyeButtonShow = props => {
  return (
    <div className='EyeButtonShow'>
      {
        props.show
          ? <SvgEye/>
          : <SvgCloseEye/>
      }
    </div>
  )
}

export default EyeButtonShow