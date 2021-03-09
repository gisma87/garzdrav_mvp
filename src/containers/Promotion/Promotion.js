import React from "react";
import './Promotion.scss'
import Article1 from "./articles1/Article1";
import Article2 from "./articles2/Articles2";
import Article3 from "./articles3/Articles3";
import Article4 from "./articles4/Articles4";
import {Redirect, withRouter} from "react-router-dom";


const Promotion = ({itemId}) => {
  switch (+itemId) {
    case 1:
      return <Article1/>
    case 2:
      return <Article2/>
    case 3:
      return <Article3/>
    case 4:
      return <Article4/>
    default:
      return <Redirect to={'/'}/>
  }
}

export default withRouter(Promotion)