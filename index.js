/**
 * requirements gonna get required
 */
var fs        = require('fs');

var settings  = require('./helpers/settings.js');
var files     = require('./helpers/files.js');
var lines     = require('./helpers/lines.js');
var output    = require('./helpers/output.js');

/**
 * an array representing the file contents with information about
 * every line, where each line is an object.
 *
 * these include:
 *   - folder/file name as a string (line.string)
 *   - line number                  (line.line)
 *   - indentation level            (line.level)
 *   - line type (folder, file)     (line.type)
 *   - comment, if present          (line.comment)
 *
 * @type {Array}
 */
var structure = [];

module.exports = function (opt) {
  opt = opt || {};

  if (!opt.input) {
    opt = settings._merge(settings._settings, { input: opt });
  } else {
    opt = settings._merge(settings._settings, opt);
  }

  fs.readFile(opt.input, {
    encoding: 'UTF-8'
  }, function (err, data) {
    if (err) throw err;

    /**
     * turn file contents into an array.
     * each element is a separate line from the file.
     *
     * @type {Array}
     */
    data = data.split('\n');

    /**
     * determine the indentation type (tabs or spaces) and the amount
     * of whitespace, e.g. 2 spaces, 4 spaces, etc.
     * write these informations into the settings object for later use.
     */
    data.forEach(function (element, index) {
      if (!element || index > 1) return;

      if (index === 1) {
        var indentation_level = element.length - element.match(/\s+(.+)/)[1].length;

        /**
         * if the indentation level is higher than 1, spaces were used.
         * as the default settings are tabs, we only need to overwrite
         * the settings object if there are spaces.
         */
        if (indentation_level > 1) {
          settings.set({
            indentation_level: indentation_level,
            indentation_type: 'spaces'
          });
        }

        return false;
      }
    });

    data.forEach(function (element, index) {
      var line = lines.getLineObj(element, index);

      if (line.multiline_comment) {
        line.comment = output.multilineComment({
          line: line,
          data: data,
          index: index
        });
      }

      // skip empty line objects
      if (line.initial !== '' && line.string !== undefined) {
        structure.push(line);
      }
    });

    structure.forEach(function (sline1, index1) {
      structure.forEach(function (sline2, index2) {
        if (sline1.level === sline2.level && sline2.string && sline1.string) {
          if (sline2.string.length > sline1.string.length) {
            settings._push('_line_maxlength', sline2.string.length + sline2.indentation);
          }
        }
      });
    });

    if (settings.get('_line_maxlength').length > 0) {
      settings.set({
        _line_maxlength: settings.get('_line_maxlength').reduce(function (x, y) {
          return (x > y) ? x : y;
        })
      });
    }

    var file_structure = output.get(structure);

    var output_path = files.getOutputPath(opt.output);

    if (output_path.match(/^[\/][^\/]+\//)) {
      files.writeFullPath(output_path, file_structure);
    } else {
      files.writeFile(output_path, file_structure);
    }

    // reset these, as they are global (ugly)
    settings.set({
      _line_maxlength: []
    });

    structure = [];
  });
};
