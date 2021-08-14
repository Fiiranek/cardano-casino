import { counter } from './counter'

import { combineReducers } from 'redux'

export const allReducers = combineReducers({
    counter:counter
})