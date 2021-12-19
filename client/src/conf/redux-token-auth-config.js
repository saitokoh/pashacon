import { generateAuthActions } from "redux-token-auth"

const config = {
  authUrl: '/api/v1/auth',
  userAttributes: {
    id: 'id',
    email: 'email',
    name: 'name',
    userTypeId: 'user_type_id',
  },
  userRegistrationAttributes: {
    name: 'name',
    password: 'password',
    passwordConfirmation: 'passwordConfirmation',
    token: 'token',
  },
  storage: {
    flushGetRequests: false,
  },
}
const {
  registerUser,
  signInUser,
  signOutUser,
  verifyCredentials,
} = generateAuthActions(config)
const authHeaderKeys = ["access-token", "token-type", "client", "expiry", "uid"]
export { registerUser, signInUser, signOutUser, verifyCredentials, authHeaderKeys }