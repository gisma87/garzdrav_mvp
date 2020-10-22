const pillsLoaded = (newPills) => {
  return {
    type: 'PILLS_LOADED',
    payload: newPills
  }
}

const pillsRequested = () => {
  return {
    type: 'PILLS_REQUESTED'
  }
}

const pillsError = (error) => {
  return {
    type: 'PILLS_ERROR',
    payload: error
  }
}

export {
  pillsLoaded,
  pillsRequested,
  pillsError
}