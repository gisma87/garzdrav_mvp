class Service {

    wrapperRefreshToken(callback: (accessToken?: string) => Promise<any>, refreshToken: () => Promise<any>) {
        callback().catch(_ => {
            refreshToken().then(res => callback(res.accessToken))
        })
    }

}

const service = new Service()
export {service}
export default service