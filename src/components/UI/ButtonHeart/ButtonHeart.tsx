import React from "react";
import SvgHeartSolid from "../icons/SvgHeartActive";
import SvgHeartIcon from "../icons/SvgHeartIcon";

type Props = {
    active: boolean
}

const ButtonHeart: React.FC<Props> = props => {

    return (
        <>{props.active ? <SvgHeartSolid/> : <SvgHeartIcon/>}</>
    )
}

export default ButtonHeart