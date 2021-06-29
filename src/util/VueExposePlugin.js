export default {
  install(app, options) {
    Object.keys(options).forEach((key) => {
      if (app[key]) {
        // eslint-disable-next-line no-console
        console.error(`Skipping ${key}. ${key} already exists on the Vue prototype`);
      } else {
        app.provide(key, options[key]);
      }
    });
  },
};
