import Vue from 'vue'
window.Vue = Vue;

window._ = require('lodash');
window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import App from './App.vue'
import app from './assets/sass/app.scss'

// FONT AWESOME
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { faSort } from '@fortawesome/free-solid-svg-icons'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCoffee, faTachometerAlt,faCog,faPlus,faTimes,faSort,faLink,faTwitter)

Vue.component('font-awesome-icon', FontAwesomeIcon)

// COMPONENTS
import Project from './assets/js/components/Project.vue';
Vue.component('project', Project)
import Editable from './assets/js/components/Editable.vue';
Vue.component('editable', Editable)

new Vue({
    el: '#app',
    render: h => h(App)
})
