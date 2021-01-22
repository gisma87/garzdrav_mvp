import React, {useEffect, useState} from "react";
import {addToFavorites, delToFavorites, refreshAuthentication} from "../../actions";
import {connect} from "react-redux";
import PopupLogin from "../../components/PopupLogin/PopupLogin";
import service from "../../service/service";

const SetToFavorites = props => {

  const [isLike, setIsLike] = useState(false)
  const [showPopupLogin, setShowPopupLogin] = useState(false)

  const isFavorites = () => {
    if (props.favorites.length) {
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
        service.wrapperRefreshToken(() => props.delToFavorites(props.productGuid), props.refreshAuthentication)
      } else {
        setIsLike(true)
        service.wrapperRefreshToken(() => props.addToFavorites(props.productGuid), props.refreshAuthentication)

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
    delToFavorites: (productGuid) => dispatch(delToFavorites(productGuid)),
    refreshAuthentication: () => dispatch(refreshAuthentication())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetToFavorites)