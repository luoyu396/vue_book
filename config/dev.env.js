'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST: '"/bookmanage/"',
  IMG_PATH: '"http://127.0.0.1/bookimg/"',
  Mock: true
})
