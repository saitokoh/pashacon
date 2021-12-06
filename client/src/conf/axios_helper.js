import { axios } from "redux-token-auth"
import { authHeaderKeys } from 'conf/redux-token-auth-config'

const getStorage = () => {
  return window.localStorage
}

const getVerificationParams = () => {
  const result = {}
  const storage = getStorage()
  authHeaderKeys.forEach(key => {
    if (storage.getItem(key)) result[key] = storage.getItem(key)
  })
  return result
}

const saveHeaders = response => {
  if (response && response.headers) {
    const storage = getStorage()
    authHeaderKeys.forEach(key => {
      if (response.headers[key]) {
        storage.setItem(key, response.headers[key])
        axios.defaults.headers.common[key] = response.headers[key]
      }
    })
  }
}

const withoutRedirectPaths = [
  '/api/v1/auth/sign_in',
  '/api/v1/auth/validate_token'
]

export default {
  setupInterceptors: (store, verifyCredentials) => {
    const instance = axios

    instance.interceptors.request.use(
      request => {
        const verificationParams = getVerificationParams()
        request.headers = { ...verificationParams }
        return request
      },
      function (error) {
        return Promise.reject(error)
      }
    )

    instance.interceptors.response.use(
      response => {
        saveHeaders(response)
        return response
      },
      function (error) {
        saveHeaders(error.response)
        if (error.response.status === 401 && !withoutRedirectPaths.includes(error.response.config.url)){
          verifyCredentials(store)
        }
        return Promise.reject(error)
      }
    )
  }
}