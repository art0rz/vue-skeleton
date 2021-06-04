// eslint-disable-next-line import/extensions
import 'modernizr';
import { createApp, h } from 'vue';
import VueI18nManager from 'vue-i18n-manager';
import { sync } from 'vuex-router-sync';
import './asset/style/screen.scss';

import './settings/settings';
import directive from './directive/directive';
import component from './component/component';
import getRouter from './router/router';
import getStore from './store/store';
import startUp from './control/startUp';
import getLocaleConfig from './config/localeConfig';
import setupInjects from './util/setupInjects';
import localeLoader from './util/localeLoader';
import App from './App';
import filter from './filter/filter';

setupInjects();

if (window.webpackPublicPath) {
  // eslint-disable-next-line
  __webpack_public_path__ = window.webpackPublicPath;
}

// Init new vue app
const app = createApp({
  render: () => h(App),
});

const router = getRouter();
app.use(router);
const localeConfig = getLocaleConfig();

const store = getStore();
app.use(store);

// sync router data to store
sync(store, router);

// register filters globally
Object.keys(filter).forEach((key) => app.filter(key, filter[key]));

// register directives globally
Object.keys(directive).forEach((key) => app.directive(key, directive[key]));

// register components globally
Object.keys(component).forEach((key) => app.component(key, component[key]));

if (localeConfig.localeEnabled) {
  app.use(VueI18nManager, {
    store,
    router: localeConfig.localeRoutingEnabled ? router : null,
    config: localeConfig.config,
    proxy: localeLoader,
  });
  // Vue.initI18nManager();
}

// Mount the app after startUp
startUp(app, store).then(() => {
  app.mount('#app');
});
