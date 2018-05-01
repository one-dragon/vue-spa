
// require('es6-promise').polyfill();
import 'babel-polyfill';

require('~/assets/css/public');

import Vue from 'vue';
import router from '~/router';
import i18n from '~/i18n';
import store from '~/store';


new Vue({
    el: '#app',
    data: {},
    router,
    i18n,
    store
})
