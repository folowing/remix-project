const semver = require('semver')
const minixhr = require('minixhr')
/* global Worker */

export const baseURLBin = 'https://binaries.soliditylang.org/bin'
export const baseURLWasm = 'https://binaries.soliditylang.org/wasm'
export const baseURLTron = 'https://tronsuper.github.io/tron-solc-bin/bin'

export const pathToURL = {}

/**
 * Retrieves the URL of the given compiler version
 * @param version is the version of compiler with or without 'soljson-v' prefix and .js postfix
 */
export function urlFromVersion (version) {
  if (!version.startsWith('soljson_v')) version = 'soljson_v' + version
  if (!version.endsWith('.js')) version = version + '.js'
  return `${pathToURL[version]}/${version.replace(/\+commit.[0-9,a-z]+/g, '')}`
}

/**
 * Checks if the worker can be used to load a compiler.
 * checks a compiler whitelist, browser support and OS.
 */
export function canUseWorker (selectedVersion) {
  const version = semver.coerce(selectedVersion)
  return browserSupportWorker() && semver.gt(version, '0.5.13')
}

function browserSupportWorker () {
  return document.location.protocol !== 'file:' && Worker !== undefined
}

// returns a promise for minixhr
export function promisedMiniXhr (url) {
  return new Promise((resolve, reject) => {
    minixhr(url, (json, event) => {
      resolve({ json, event })
    })
  })
}
