var _this = this;

exports._settings = {
  output: 'LAY-OUT.md',
  indentation_level:  2,
  indentation_type:   'tabs',
  _line_maxlength:     []
};

exports._merge = function () {
  var out = {};

  if (!arguments.length)
    return out;

  for (var i=0; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      out[key] = arguments[i][key];
    }
  }

  return out;
};

exports._push = function (key, value) {
  _this._settings[key].push(value);

  return _this._settings;
};

exports.get = function (key) {
  if (key) {
    return _this._settings[key];
  } else {
    return _this._settings;
  }
};

exports.set = function (obj) {
  _this._settings = _this._merge(_this._settings, obj);

  return _this._settings;
};
