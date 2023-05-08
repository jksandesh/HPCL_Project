import axios from 'axios'
import Vue from 'vue'
import VueFlashMessage from 'vue-flash-message'
import 'vue-flash-message/dist/vue-flash-message.min.css'
import router from '../router'
Vue.use(VueFlashMessage, {
  messageOptions: {
    timeout: 3000,
    pauseOnInteract: true
  }
})

const vm = new Vue()
// const baseURL = 'http://127.0.0.1:4000/'
// const baseURL = 'http://20.244.9.231:4000/'
const baseURL = 'https://verifyonblockchain.hpcl.co.in:4000/'
const blockchainURL = 'https://verifyonblockchain.hpcl.co.in:8989/'
// const baseURL = 'https://10.90.38.35:4000/'
// const blockchainURL = 'http://10.90.38.35:8989/'

const handleError = fn => (...params) =>
  fn(...params).catch(error => {
    vm.flash(`${error.response.status}: ${error.response.statusText}`, 'error')
  })

// axios.interceptors.response.use(function (response) {
//   }, function (error) {
//     if (error.response.status === 403) {
//       router.replace("/")
//     }
//     return Promise.reject(error);
// })
export const api = {
  getCitizen: handleError(async id => {
    const res = await axios.get(baseURL + 'citizen/' + id).catch(function (error) {
      if (error.response.status === 403 || error.response.status === 500) {
        router.replace('/')
      }
    })
    return res.data
  }),
  searchCitizen: handleError(async id => {
    const res = await axios.get(baseURL + 'search/' + id).catch(function (error) {
      if (error.response.status === 403 || error.response.status === 500) {
        router.replace('/')
      }
    })
    return res.data
  }),
  searchCitizenByName: handleError(async id => {
    const res = await axios.get(baseURL + 'searchByName/' + id).catch(function (error) {
      if (error.response.status === 403 || error.response.status === 500) {
        router.replace('/')
      }
    })
    return res.data
  }),
  searchCitizenBySurveyorId: handleError(async id => {
    const res = await axios.get(baseURL + 'searchBySurveyorId/' + id).catch(function (error) {
      if (error.response.status === 403 || error.response.status === 500) {
        router.replace('/')
      }
    })
    return res.data
  }),
  getSurveyor: handleError(async id => {
    const res = await axios.get(baseURL + 'surveyor/' + id).catch(function (error) {
      if (error.response.status === 403 || error.response.status === 500) {
        router.replace('/')
      }
    })
    return res.data
  }),
  login: handleError(async payload => {
    const res = await axios.post(baseURL + 'login', payload).catch(function (error) {
      if (error.response.status === 403 || error.response.status === 500) {
        router.replace('/')
      }
    })
    return res.data
  }),
  postOnNear: handleError(async payload => {
    const res = await axios.post(baseURL + 'setHash', payload).catch(function (error) {
      if (error.response.status === 403 || error.response.status === 500) {
        router.replace('/')
      }
    })
    return res.data
  }),
  verifyOnNear: handleError(async id => {
    const res = await axios.get(baseURL + 'getHash/' + id).catch(function (error) {
      if (error.response.status === 403 || error.response.status === 500) {
        router.replace('/')
      }
    })
    return res.data
  }),
  updateCitizenProfile: handleError(async payload => {
    const res = await axios.post(baseURL + 'taluka/editCitizen', payload).catch(function (error) {
      if (error.response.status === 403 || error.response.status === 500) {
        router.replace('/')
      }
    })
    return res.data
  }),
  createOfflineData: handleError(async payload => {
    const res = await axios.post(baseURL + 'offlineData', payload).catch(function (error) {
      if (error.response.status === 403 || error.response.status === 500) {
        router.replace('/')
      }
    })
    return res.data
  })
}

export const blockchainApi = {

  getPOsOnChain: handleError(async () => {
    const res = await axios.get(blockchainURL + 'api/queryAllPOs').catch(function (error) {
      if (error.response.status === 403 || error.response.status === 500) {
      }
    })
    return res.data
  }),
  getOnePO: handleError(async id => {
    const res = await axios.get(blockchainURL + 'api/query/' + id).catch(function (error) {
      if (error.response.status === 403 || error.response.status === 500) {
      }
    })
    return res.data
  }),
  addAllPOsOnChain: handleError(async payload => {
    const res = await axios.post(blockchainURL + 'api/addAllPOs/', payload).catch(function (error) {
      if (error.response.status === 403 || error.response.status === 500) {
      }
    })
    return res.data
  }),
  addMetaDataOnChain: handleError(async payload => {
    const res = await axios.post(blockchainURL + 'api/addMetaDataToPO/', payload).catch(function (error) {
      if (error.response.status === 403 || error.response.status === 500) {
      }
    })
    return res.data
  }),
  updatePOsOnChain: handleError(async payload => {
    const res = await axios.post(blockchainURL + 'api/changePOData/', payload).catch(function (error) {
      if (error.response.status === 403 || error.response.status === 500) {
      }
    })
    return res.data
  }),
  getHistoryOnChain: handleError(async id => {
    const res = await axios.get(blockchainURL + 'api/queryHistory/' + id).catch(function (error) {
      if (error.response.status === 403 || error.response.status === 500) {
      }
    })
    return res.data
  })
}
