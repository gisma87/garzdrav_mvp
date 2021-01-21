class Service {

  wrapperRefreshToken(func, refreshToken) {
    func().catch(error => {
      refreshToken().then(res => func())
    })
  }

}

const service = new Service()

export default service