class Service {

  wrapperRefreshToken(callback, refreshToken) {
    callback().catch(_ => {
      refreshToken().then(res => callback(res.accessToken))
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
export {service}
export default service