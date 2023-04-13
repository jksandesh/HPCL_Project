import Vue from 'vue'
import Vuex from 'vuex'
import { api } from '@/helpers/helpers'
import swal from 'sweetalert'
import axios from 'axios'

Vue.use(Vuex)
const token = localStorage.getItem('jwt')
axios.defaults.headers.token = token
const getInitialState = () => {
  const userInfoStr = localStorage.getItem('userInfo')
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {}
  return {
    /* User */
    taluka: null,
    username: null,
    userAvatar: null,
    userType: null,
    uniqueCode: null,
    urbanRural: null,

    /* NavBar */
    isNavBarVisible: true,

    /* FooterBar */
    isFooterBarVisible: true,

    /* Aside */
    isAsideVisible: true,
    isAsideMobileExpanded: false,

    ...userInfo
  }
}

// TODO: watch token and change axios default headers

export default new Vuex.Store({
  state: getInitialState(),
  mutations: {
    /* A fit-them-all commit */
    basic (state, payload) {
      state[payload.key] = payload.value
    },

    /* User */
    user (state, payload) {
      if (payload.taluka) {
        state.taluka = payload.taluka
      }
      if (payload.username) {
        state.username = payload.username
      }
      if (payload.avatar) {
        state.userAvatar = payload.avatar
      }
      if (payload.userType) {
        state.userType = payload.userType
      }
      if (payload.uniqueCode) {
        state.uniqueCode = payload.uniqueCode
      }
      if (payload.urbanRural) {
        state.urbanRural = payload.urbanRural
      }
    },

    /* Aside Mobile */
    asideMobileStateToggle (state, payload = null) {
      const htmlClassName = 'has-aside-mobile-expanded'

      let isShow

      if (payload !== null) {
        isShow = payload
      } else {
        isShow = !state.isAsideMobileExpanded
      }

      if (isShow) {
        document.documentElement.classList.add(htmlClassName)
      } else {
        document.documentElement.classList.remove(htmlClassName)
      }

      state.isAsideMobileExpanded = isShow
    },
    /* Full Page mode */
    fullPage (state, payload) {
      state.isNavBarVisible = !payload
      state.isAsideVisible = !payload
      state.isFooterBarVisible = !payload
    }
  },
  actions: {
    asideDesktopOnlyToggle (store, payload = null) {
      let method

      switch (payload) {
        case true:
          method = 'add'
          break
        case false:
          method = 'remove'
          break
        default:
          method = 'toggle'
      }
      document.documentElement.classList[method]('has-aside-desktop-only-visible')
    },
    toggleFullPage ({ commit }, payload) {
      commit('fullPage', payload)

      document.documentElement.classList[!payload ? 'add' : 'remove']('has-aside-left', 'has-navbar-fixed-top')
    },
    async login ({ commit }, payload) {
      try {
        const response = await api.login(payload)
        const token = response.token
        if (token) {
          axios.defaults.headers.token = token
          swal('Success', 'Login Successful', 'success')
          this.isLoading = false
          const userInfo = {
            taluka: response.user.taluka,
            username: response.user.username,
            avatar: '',
            userType: response.user.type,
            uniqueCode: response.user.uniqueCode,
            urbanRural: response.user.urbanRural
          }
          commit('user', userInfo)
          localStorage.setItem('jwt', token)
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
          return true
        }
      } catch (e) {
        swal('Error', 'Something Went Wrong', 'error')
      }
      return false
    },
    async logout ({ commit }) {
      localStorage.removeItem('jwt')
      localStorage.removeItem('userInfo')
      return true
    }
  }
})
