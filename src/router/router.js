import { createRouter, createWebHistory } from 'vue-router';
import { routeParser } from 'vue-i18n-manager';
import { PropertyNames, VariableNames } from '../data/enum/configNames';
import getLocaleConfig from '../config/localeConfig';
import { CONFIG_MANAGER } from '../data/Injectables';
import { getValue } from '../util/injector';

import routes from './routes';

let router = null;

const getRouter = () => {
  if (!router) {
    const localeConfig = getLocaleConfig();
    const configManager = getValue(CONFIG_MANAGER);

    const processedRoutes =
      localeConfig.localeEnabled && localeConfig.localeRoutingEnabled
        ? routeParser(routes, configManager.getProperty(PropertyNames.DEFAULT_LOCALE))
        : routes.concat({
            path: '/:pathMatch(.*)*',
            redirect: '/',
          });

    router = createRouter({
      history: createWebHistory(),
      routes: processedRoutes,
      base: configManager.getVariable(VariableNames.PUBLIC_PATH),
    });

    router.beforeEach((to, from, next) => {
      const persistQueryParams = configManager.getProperty(PropertyNames.PERSIST_QUERY_PARAMS);

      let redirect = false;
      const { ...query } = to.query;

      if (persistQueryParams && persistQueryParams.length > 0) {
        persistQueryParams.forEach((queryParam) => {
          if (
            typeof from.query[queryParam] !== 'undefined' &&
            typeof query[queryParam] === 'undefined'
          ) {
            query[queryParam] = from.query[queryParam];

            redirect = true;
          }
        });
      }

      if (redirect) {
        next({ path: to.path, query });
      } else {
        next();
      }
    });
  }

  return router;
};

export default getRouter;
