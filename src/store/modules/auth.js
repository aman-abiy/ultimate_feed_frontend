import axios from 'axios'
import router from '../../router'
import asyncHandler from '@/utils/async_handler'
import { SET_ACCOUNT, SET_SESSION_TOKEN, SET_ERRORMSG } from '../mutation_types'
import {
    LOGIN,
    SIGNUP,
    LOGOUT,
    CLEAR_ACCOUNT_ISLOADING,
    GET_ACCOUNT
} from '../action_types'
import { LOGIN_URL, SIGNUP_URL } from '../../utils/urls'
import { AUTH_LOGIN_ERROR_MSG, AUTH_SIGNUP_ERROR_MSG } from '../../utils/consts'
import errorMsgs from '../../utils/error_msgs'

const account = {
    state: {
        account: {
            data: null,
            status: null,
            isLoading: false
        },
        sessionToken: null
    },
    getters: {
        account: state => state.account,
        sessionToken: state => state.sessionToken
    },
    mutations: {
        [SET_ACCOUNT]: (state, payload) => { payload.data != null ? state.account.data = payload.data : null, state.account.status = payload.status, state.account.isLoading = payload.isLoading },
        [SET_SESSION_TOKEN]: (state, payload) => { state.sessionToken = payload }
    },
    actions: {
        [LOGIN]: asyncHandler(async({ commit }, payload) => {
            commit(SET_ACCOUNT, { isLoading: true })
            console.log('payload', payload)
            const result = await axios.post(LOGIN_URL, {
                email: payload.email,
                password: payload.password
            })

            if (result.status == 200) {
                commit(SET_SESSION_TOKEN, result.data.token)
                commit(SET_ACCOUNT, { data: result.data.user, isLoading: false })
                router.push({ name: 'Dashboard' })
                    // router.go()
                return
            }
            commit(SET_ACCOUNT, { isLoading: false })
            commit(SET_ERRORMSG, errorMsgs[result.status])
        }),
        [SIGNUP]: asyncHandler(async({ commit }, payload) => {
            commit(SET_ACCOUNT, { isLoading: true })
            console.log('payload SP', payload)
            const result = await axios.post(SIGNUP_URL, {
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                phone: payload.phone,
                password: payload.password
            })
            console.log('result.data.statusCode', result.data.status)

            if (result.status == 200) {
                commit(SET_ACCOUNT, { data: result.data.data, isLoading: false })
                commit(SET_SESSION_TOKEN, result.data.sessionToken)
                router.push({ name: 'Dashboard' })
                    // router.go()
                return
            }
            console.log('errorMsgs[result.status]', errorMsgs[result.status])
            commit(SET_ACCOUNT, { isLoading: false })
            commit(SET_ERRORMSG, errorMsgs[result.status])
        }),
        [LOGOUT]: asyncHandler(async({ commit }) => {
            commit(SET_ACCOUNT, { isLoading: false })
            commit(SET_SESSION_TOKEN, null)
            commit(SET_ERRORMSG, errorMsgs[result.status])
            router.go()
            return
        }),
        [GET_ACCOUNT]: asyncHandler(async({ commit }, payload) => {
            commit(SET_ACCOUNT, { isLoading: true })
            const result = await axios.get(GET_ACCOUNT_URL, {
                params: {

                }
            })

            if (result.status == 200) {
                commit(SET_ACCOUNT, { data: result.data.user, isLoading: false })
                return
            }
        }),
        [CLEAR_ACCOUNT_ISLOADING]: asyncHandler(async({ commit }) => {
            commit(SET_ACCOUNT, { isLoading: false })
        })
    }
}

export default account