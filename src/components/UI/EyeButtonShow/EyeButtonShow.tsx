import React from "react";
import './EyeButtonShow.scss';
import SvgEye from "./icons/SvgEye";
import SvgCloseEye from "./icons/SvgCloseEye";

type Props = {
    show: boolean
}


const EyeButtonShow: React.FC<Props> = props => {
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