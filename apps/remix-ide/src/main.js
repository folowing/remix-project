window.onload = () => {
  BrowserFS.install(window)
  BrowserFS.configure({
    fs: 'LocalStorage'
  }, function (e) {
    if (e) console.log(e)
    window.remixFileSystem = BrowserFS.BFSRequire('fs')
    require('./index')
  })
}
