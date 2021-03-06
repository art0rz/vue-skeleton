import axios from 'axios';
import DeviceStateTracker from 'seng-device-state-tracker';
import VueExposePlugin from '../util/VueExposePlugin';
import { PropertyNames, URLNames, VariableNames } from '../data/enum/configNames';
import { RouteNames } from '../router/routes';
import { createPath } from '../util/routeUtils';
import Params from '../data/enum/Params';
import { getValue } from '../util/injector';
import { CONFIG_MANAGER, GATEWAY } from '../data/Injectables';
import localeLoader from '../util/localeLoader';
import mediaQueries from '../data/mediaQueries.json';
import waitForStyleSheetsLoaded from '../util/waitForStyleSheetsLoaded';

const initPlugins = (app) => {
  const configManager = getValue(CONFIG_MANAGER);

  const cleanMediaQueries = Object.keys(mediaQueries.mediaQueries).reduce((result, key) => {
    result[key] = mediaQueries.mediaQueries[key].replace(/'/g, '');
    return result;
  }, {});

  // expose objects to the Vue prototype for easy access in your vue templates and components
  app.use(VueExposePlugin, {
    $config: configManager,
    $gateway: getValue(GATEWAY),
    $http: axios,
    $versionRoot: configManager.getVariable(VariableNames.VERSIONED_STATIC_ROOT),
    $staticRoot: configManager.getVariable(VariableNames.STATIC_ROOT),
    URLNames,
    PropertyNames,
    VariableNames,
    RouteNames,
    Params,
    createPath,
    $deviceStateTracker: new DeviceStateTracker({
      mediaQueries: cleanMediaQueries,
      deviceState: mediaQueries.deviceState,
      showStateIndicator: process.env.NODE_ENV !== 'production',
    }),
    DeviceState: mediaQueries.deviceState,
  });
};

const waitForLocale = (store) =>
  new Promise((resolve) => {
    if (localeLoader.isLoaded(store.getters.currentLanguage.code)) {
      resolve();
    } else {
      localeLoader.setLoadCallback((locale) => {
        if (locale === store.getters.currentLanguage.code) {
          resolve();
        }
      });
    }
  });

const startUp = (app, store) => {
  // Initialise plugins
  initPlugins(app);

  const configManager = getValue(CONFIG_MANAGER);

  // Add async methods to the Promise.all array
  return Promise.all([
    configManager.getVariable(VariableNames.LOCALE_ENABLED)
      ? waitForLocale(store)
      : Promise.resolve(),
    process.env.NODE_ENV !== 'production' ? waitForStyleSheetsLoaded(document) : Promise.resolve(),
  ]);
};

export default startUp;
