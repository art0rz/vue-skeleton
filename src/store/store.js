import Vuex from 'vuex';
import modules from './modules';

let store = null;

const getStore = () => {
  if (!store) {
    store = new Vuex.Store({
      modules,
      strict: process.env.NODE_ENV !== 'production',
    });
  }

  return store;
};

export default getStore;
