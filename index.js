/**
 * requirements gonna get required
 */
var fs        = require('fs');

var settings  = require('./settings.js');
var files     = require('./files.js');
var lines     = require('./lines.js');
var output    = require('./output.js');

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

module.exports = {
  create: function (file_input, file_output) {
    fs.readFile(file_input, {
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
       * write those informations into the settings object for later use.
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

        // skip empty line objects
        if (line.initial !== '') {
          structure.push(line);
        }
      });

      structure.forEach(function (sline1, index1) {
        structure.forEach(function (sline2, index2) {
          if (sline1.level === sline2.level) {
            if (sline2.string.length > sline1.string.length) {
              settings._push('line_maxlength', sline2.string.length + sline2.indentation);
            }
          }
        });
      });

      if (settings.get('line_maxlength').length > 0) {
        settings.set({
          line_maxlength: settings.get('line_maxlength').reduce(function (x, y) {
            return (x > y) ? x : y;
          })
        });
      }

      var file_structure = output.get(structure);

      var output_path = files.getOutputPath(file_output);

      if (output_path.match(/^[\/][^\/]+\//)) {
        files.writeFullPath(output_path, file_structure);
      } else {
        files.writeFile(output_path, file_structure);
      }

      // reset those, as they are global (ugly)
      settings.set({
        line_maxlength: []
      });

      structure = [];
    });
  }
};