import React, {useEffect, useState} from "react";
import {addToFavorites, delToFavorites} from "../../actions";
import {connect} from "react-redux";
import PopupLogin from "../../components/PopupLogin/PopupLogin";

const SetToFavorites = props => {

  const [isLike, setIsLike] = useState(false)
  const [showPopupLogin, setShowPopupLogin] = useState(false)

  const isFavorites = () => {
    if(props.favorites.length) {
      return props.favorites.some(item => item.guid === props.productGuid)
    }
    return false;
  };

  useEffect(() => {
    setIsLike(isFavorites)
  })

  function setFavorites() {
    if (props.TOKEN) {
      if (isFavorites()) {
        setIsLike(false)
        props.delToFavorites(props.productGuid)
      } else {
        setIsLike(true)
        props.addToFavorites(props.productGuid)
      }
    } else {
      setShowPopupLogin(true)
    }
  }

  return (
    <>
      <div onClick={setFavorites}>
        {React.cloneElement(
          props.children,
          {
            active: isLike
          }
        )}
      </div>
      <PopupLogin active={showPopupLogin}
                  onClick={() => setShowPopupLogin(false)}
      />
    </>
  )
}

const mapStateToProps = ({favorites, TOKEN}) => {
  return {favorites, TOKEN}
}

const mapDispatchToProps = (dispatch) => {
  return {
    addToFavorites: (productGuid) => dispatch(addToFavorites(productGuid)),
    delToFavorites: (productGuid) => dispatch(delToFavorites(productGuid))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetToFavorites)