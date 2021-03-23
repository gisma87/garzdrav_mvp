class Service {

  wrapperRefreshToken(callback, refreshToken) {
    callback().catch(_ => {
      refreshToken().then(res => callback(res.accessToken))
    })
  }

}

const service = new Service()
export {service}
export default service