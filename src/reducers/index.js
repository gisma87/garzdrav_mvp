const initialState = {
  pills: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PILLS_LOADED':
      return {
        pills: action.payload
      };
    default:
      return state;
  }
}

export default reducer;