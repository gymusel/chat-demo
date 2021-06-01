import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import "./assets/tailwind.css"
import "./firebase"

import CountryFlag from 'vue-country-flag'
Vue.component('country-flag', CountryFlag)

import { library } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { far } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
library.add(fas, fab, far)
Vue.component("font-awesome-icon", FontAwesomeIcon)

import OnoffToggle from 'vue-onoff-toggle'
Vue.use(OnoffToggle)

// import VueLazyload from 'vue-lazyload'
// const loadimage = require('./assets/logo.png')

// Vue.use(VueLazyload, {
//   preLoad: 1.3,
//   // error: errorimage,
//   loading: loadimage,
//   attempt: 1
// })

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app")
