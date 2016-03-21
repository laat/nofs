const fuse = require('fuse-bindings')
fuse.unmount('./mnt', function () {
  process.exit()
})
