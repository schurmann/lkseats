// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'bootstrap';

import Vue from 'vue';
import VueScrollTo from 'vue-scrollto';
import App from './components/App';

Vue.use(VueScrollTo);
Vue.config.productionTip = process.env.NODE_ENV === 'development';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
});
