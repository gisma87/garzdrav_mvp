
const pillsLoaded = (newPills) => {
  return {
    type: 'PILLS_LOADED',
    payload: newPills
  }
}

export  {
  pillsLoaded
}