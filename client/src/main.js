import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './../node_modules/jquery/dist/jquery.min.js';
import './../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './../node_modules/bootstrap/dist/js/bootstrap.min.js';
import VueChartkick from 'vue-chartkick'
import Chart from 'chart.js'
import Paginate from 'vuejs-paginate'

Chart.defaults.line.fill = true
Chart.defaults.line.animation = true

Vue.component('paginate', Paginate)
Vue.use(VueChartkick, {adapter: Chart})

Vue.filter('currency', function (value) {
  return '$' + parseFloat(value).toFixed(2);
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
