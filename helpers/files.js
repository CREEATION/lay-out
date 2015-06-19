var _this = this;

/**
 * requirements gonna get required
 */
var fs        = require('fs');
var mkdirp    = require('mkdirp');

exports.removeFilename = function (path) {
  path = path.split('/');

  path.pop();
  path.shift();

  return path.join('/') + '/';
};

exports.writeFile = function (path, output) {
  fs.writeFile(path.match(/^\/(.+)/)[1], output, function (err) {
    if (err) throw err;
  });

  return true;
};

exports.writeFullPath = function(path, output) {
  mkdirp(_this.removeFilename(path), function (err) {
    if (err) {
      console.error(err);
    } else {
      _this.writeFile(path, output);
    }
  });
};

exports.getOutputPath = function(path) {
  if (path !== undefined && path[0] !== '/') {
    path = '/' + path;
  }

  return path;
};
