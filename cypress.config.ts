import { defineConfig } from 'cypress'

export default defineConfig({
  "watchForFileChanges":true,
  "waitForAnimations":true,
  "defaultCommandTimeout":5000,
  "execTimeout":60000,
  "pageLoadTimeout":60000,
  "requestTimeout":15000,
  "responseTimeout":15000,
  "component": {
    "devServer": {
      "framework": "next",
      "bundler": "webpack"
    }
  },

  e2e: {
    "experimentalSessionAndOrigin":true,
    baseUrl:"http://localhost:3000/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  }
})