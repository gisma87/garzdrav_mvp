import React from "react";
import './Loader.scss'

type Props = {
    classStyle: string
}

const Loader: React.FC<Props> = ({classStyle}) => {
    return (
        <div className={'Loader ' + classStyle}>
            <div className="container">
                <div className="item-1">
                    <div/>
                </div>
                <div className="item-2">
                    <div/>
                </div>
                <div className="item-3">
                    <div/>
                </div>
                <div className="item-4">
                    <div/>
                </div>
                <div className="item-5">
                    <div/>
                </div>
                <div className="item-6">
                    <div/>
                </div>
                <div className="item-7">
                    <div/>
                </div>
                <div className="item-8">
                    <div/>
                </div>
                <div className="item-9">
                    <div/>
                </div>
            </div>
        </div>
    )
}

export default Loader