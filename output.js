var _this = this;

var settings  = require('./settings.js');
var lines     = require('./lines.js');

exports.get = function (array) {
  var output = '# ';

  if (array[0].comment) {
    output += array[0].comment;
    array[0].comment = false;
  } else {
    output += 'lay-out';
  }

  output += '\n```\n';

  Object.keys(array).forEach(function (index) {
    var line = array[index];
    var indentation = line.level * settings.get('indentation_level');
    var linechar_count = 0;

    if (index > 0) {
      if (line.type === 'folder' && line.level < 2) {
        output += '  + ';
      } else {
        output += '  |';
      }
    } else {
      output += '+ ';
    }

    linechar_count++;
    linechar_count++;

    if (line.type === 'folder' && line.level >= 2) {
      linechar_count++;
    }

    if (line.type === 'file') {
      if (line.level >= 2) {
        linechar_count++;
      }
    }

    /**
     * add indentation before each line
     */
    var indentation_count = (indentation - 1 - linechar_count);

    for (var i = indentation_count; i >= 0; i--) {
      output += ' ';
    }

    if (line.type === 'folder' && line.level >= 2) {
      output += '+ ';
    }

    if (line.type === 'file') {
      if (line.level >= 2) {
        output += '| ';
      } else {
        output += ' ';
      }
    }

    /**
     * actual line string
     */
    output += line.string;

    /**
     * output comment if available
     */
    if (line.comment) {
      var max_length = settings.get('line_maxlength') - line.string.length - line.indentation + linechar_count;

      output += ' ';

      if (line.level < 2) {
        output += '.';
      }

      for (var i = max_length - 1; i >= 0; i--) {
        output += '.';
      }

      output += '.. # ' + line.comment;
    }

    output += '\n';
  });

  output += '```';

  console.log(output);

  return output;
};
