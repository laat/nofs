const fuse = require('fuse-bindings')
const nodeFs = require('fs')
const nodePath = require('path')

const mountDir = './mnt'
const root = nodePath.join(process.cwd(), 'mnt_source')

function fullPath (path) {
  return nodePath.join(root, path)
}

fuse.mount(mountDir, {
  options: ['direct_io'],
  // access(path, mode, cb)
  access: function access (path, mode, cb) {
    console.log('access(%s, %s)', path, mode)
    nodeFs.access(fullPath(path), mode, cb)
  },
  // statfs(path, cb)
  // getattr(path, cb)
  getattr: function getattr (path, cb) {
    console.log('getattr(%s)', path)
    nodeFs.lstat(fullPath(path), cb)
  },
  // fgetattr(path, fd, cb)
  // flush(path, fd, cb)
  // fsync(path, fd, datasync, cb)
  fsync: function fsync (path, cb) {
    console.log('fsync(%s)', path)
    nodeFs.fsync(fullPath(path), cb)
  },
  // fsyncdir(path, fd, datasync, cb)
  // readdir(path, cb)
  readdir: function readdir (path, cb) {
    console.log('readdir(%s)', path)
    nodeFs.readdir(fullPath(path), function extendReaddir (err, files) {
      cb(err, ['.', '..'].concat(files))
    })
  },
  // truncate(path, size, cb)
  // ftruncate(path, fd, size, cb)
  // readlink(path, cb)
  // chown(path, uid, gid, cb)
  chown: function chown (path, uid, gid, cb) {
    console.log('chown(%s, %s, %s)', path, uid, gid)
    nodeFs.chown(fullPath(path), uid, gid, cb)
  },
  // chmod(path, mode, cb)
  chmod: function chmod (path, mode, cb) {
    console.log('chmod(%s, %s)', path, mode)
    nodeFs.chmod(fullPath(path), mode, cb)
  },
  // mknod(path, mode, dev, cb)
  // setxattr(path, name, buffer, length, offset, flags, cb)
  // getxattr(path, name, buffer, length, offset, cb)
  // open(path, flags, cb)
  // opendir(path, flags, cb)
  // read(path, fd, buffer, length, position, cb)
  // write(path, fd, buffer, length, position, cb)
  // release(path, fd, cb)
  // releasedir(path, fd, cb)
  // create(path, mode, cb)
  // utimens(path, atime, mtime, cb)
  // unlink(path, cb)
  unlink: function unlink (path, cb) {
    console.log('rename(%s)', path)
    nodeFs.unlink(fullPath(path), cb)
  },
  // rename(src, dest, cb)
  rename: function rename (src, dest, cb) {
    console.log('rename(%s, %s)', src, dest)
    nodeFs.rename(fullPath(src), fullPath(dest), cb)
  },
  // link(src, dest, cb)
  link: function link (src, dest, cb) {
    console.log('link(%s, %s)', src, dest)
    nodeFs.link(fullPath(src), fullPath(dest), cb)
  },
  // symlink(src, dest, cb)
  // mkdir(path, mode, cb)
  mkdir: function mkdir (path, mode, cb) {
    console.log('mkdir(%s, %s)', path, mode)
    nodeFs.mkdir(fullPath(path), mode, cb)
  },
  // rmdir(path, cb)
  rmdir: function rmdir (path, cb) {
    console.log('rmdir(%s)', path)
    nodeFs.rmdir(fullPath(path), cb)
  }
  // destroy(cb)
})

process.on('SIGINT', function () {
  fuse.unmount('./mnt', function () {
    process.exit()
  })
})
