var _this = this;

var settings = require('./settings.js');

/**
 * determine the indentation level of a given line (object).
 *
 * @param  {Object} line
 * @return {Number}
 */
exports.getLineLevel = function (line) {
  switch (_this.getLineType(line)) {
    case 'folder':
      line.level = line.initial.match(/^([\s|\t]+)[^-\s\t]/)[1];
      return line.level.replace(/\t/g, '  ').length / settings.get('indentation_level');
      break;

    case 'file':
      line.level = line.initial.match(/^([\s|\t]+)-/)[1];
      return line.level.replace(/\t/g, '  ').length / settings.get('indentation_level');
      break;

    default:
      return 0;
      break;
  }
};

exports.getLineIndentation = function (line) {
  var num_indentation = line.level * settings.get('indentation_level');
  var indentation = 0;

  for (var i = num_indentation - 1; i >= 0; i--) {
    indentation++;
  }

  return indentation;
};

exports.getLineComment = function (line) {
  var regex;

  switch (_this.getLineType(line)) {
    case 'slash':
      regex = /^\/\s?\?\s?(.+)/;
      break;

    case 'folder':
      regex = /^[\s|\t]+[^-\s\t]+[\s|\t]?\?[\s|\t](.+)/;
      break;

    case 'file':
      regex = /^[\s|\t]+-[\s|\t][^?\s\t]+[\s|\t]*?\?[\s|\t]?(.+)/;
      break;
  }

  if (line.initial.match(regex) && line.initial.match(regex)[1]) {
    return line.initial.match(regex)[1];
  } else {
    return false;
  }
};

exports.getLineString = function (line) {
  switch (_this.getLineType(line)) {
    case 'slash':
      return line.initial.match(/^(\/)\s?\??\s?/)[1];
      break;

    case 'folder':
      line = line.initial.match(/^[\s|\t]+([^-\s\t]+)/)[1];
      return line.replace(/\//g, '') + '/';
      break;

    case 'file':
      return line.initial.match(/^[\s|\t]+-[\s|\t]?([^?\s\t]+)/)[1];
      break;
  }
};

exports.fillLineObj = function (line) {
  line.string       = _this.getLineString(line);
  line.type         = _this.getLineType(line);
  line.level        = _this.getLineLevel(line);
  line.comment      = _this.getLineComment(line);
  line.indentation  = _this.getLineIndentation(line);

  return line;
};

exports.setLineObj = function (el, i) {
  return {
    initial: el,
    line: i + 1,
    indentation: 0
  };
};

exports.getLineType = function (line) {
  // very first line (must be a slash, optionally with a comment)
  if (line.initial.match(/^\//)) {
    return 'slash';

  // element is a folder
  } else if (line.initial.match(/^[\s|\t]+([^-\s\t]+)/)) {
    return 'folder';

  // element is a file
  } else if (line.initial.match(/^[\s|\t]+-/)) {
    return 'file';
  }
};

exports.getLineObj = function (el, i) {
  return _this.fillLineObj(_this.setLineObj(el, i));
};