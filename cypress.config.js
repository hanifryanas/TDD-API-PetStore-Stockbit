const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
  },
  env : {
    port : 3500,
    api : `http://localhost:3500`
  }
});
