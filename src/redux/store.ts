import {createStore, combineReducers} from 'redux'
import {reducer as authSupportReducer,AuthSupportState } from './actions/auth-support'

// app type
export type AppState = {
  authSupport: AuthSupportState
}

const appReducer = combineReducers({
  authSupport: authSupportReducer
})

// store
export default createStore(appReducer)
