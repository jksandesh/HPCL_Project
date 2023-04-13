/* Styles */
import '@/scss/main.scss'
import 'semantic-ui-css/semantic.css'

/* Core */
import Vue from 'vue'
import Buefy from 'buefy'
import VueCurrencyInput from 'vue-currency-input'

import axios from 'axios'
/* Router & Store */
import router from './router'
import store from './store'

/* Vue. Main component */
import App from './App.vue'
// import * as https from 'https'
// import * as fs from 'fs'

/* Default title tag */
const defaultDocumentTitle = 'Admin'

/* Collapse mobile aside menu on route change & set document title from route meta */
router.afterEach(to => {
  store.commit('asideMobileStateToggle', false)

  if (to.meta.title) {
    document.title = `${to.meta.title} — ${defaultDocumentTitle}`
  } else {
    document.title = defaultDocumentTitle
  }
})

// const httpsAgent = new https.Agent({
//   baseURL: 'https://localhost:4000/',
//   rejectUnauthorized: false, // (NOTE: this will disable client verification)
//   cert: fs.readFileSync('./server.cert'),
//   key: fs.readFileSync('./server.key'),
//   passphrase: 'YYY'
// })

const base = axios.create({
  baseURL: 'https://localhost:4000/'
})

Vue.prototype.$http = base
Vue.prototype.$UserType = ''
Vue.config.productionTip = false

Vue.use(Buefy)
Vue.use(VueCurrencyInput)
export const EventBus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
