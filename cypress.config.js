// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'cypress';

const baseUrl = process.env.PORT ? `http://localhost:${process.env.PORT}` : 'http://localhost:8080';

export default defineConfig({
  e2e: {
    baseUrl,
    video: false,
    supportFile: false,
    screenshotOnRunFailure: false,
    specPattern: 'cypress/e2e/*.cy.{js,jsx,ts,tsx}',
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
  component: {
    video: false,
    supportFile: false,
    screenshotOnRunFailure: false,
    specPattern: 'cypress/component/*.cy.{js,jsx,ts,tsx}',
    devServer: {
      framework: 'react',
      bundler: 'vite',
      indexHtml: 'cypress/support/component-index.html',
    },
  },
});
