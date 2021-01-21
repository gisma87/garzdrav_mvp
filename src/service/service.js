class Service {

  wrapperRefreshToken(func, refreshToken) {
    func().catch(error => {
      refreshToken().then(res => func())
    })
  }

  // runPromiseSeries(...args) {
  //   const promise = args.reduce((promise, item) => {
  //     return promise.then(() => item())
  //   }, Promise.resolve());
  //
  //   promise()
  // }

}

const service = new Service()

export default service