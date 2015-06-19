var _this = this;

var settings  = require('./settings.js');
var lines     = require('./lines.js');

exports.multilineComment = function (obj) {
  var i_lookahead = obj.index + 1;
  var line_comment = [];

  line_comment.push(obj.data[i_lookahead].match(/^\s+\?\s?(.+)$/)[1]);

  i_lookahead++;

  while (obj.data[i_lookahead].match(/^\s+\?\s?(.+)$/)) {
    line_comment.push(obj.data[i_lookahead].match(/^\s+\?\s?(.+)$/)[1]);
    i_lookahead++;
  }

  var nextline = lines.getLineObj(obj.data[i_lookahead], i_lookahead);

  /**
   * check if next line level is higher than current line's level
   */
  if (obj.line.level < nextline.level) {
    for (var i = 0; i < line_comment.length-1; i++) {
      line_comment[i] += '\n';
    }

  /**
   * if not, just ship it
   */
  } else {
    for (var i = 0; i < line_comment.length-1; i++) {
      line_comment[i] += '\n';
    }
  }

  return line_comment.join('');
};

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
      var max_length = settings.get('_line_maxlength') - line.string.length - line.indentation + linechar_count;
      var added = 0;

      output += ' ';

      if (line.level < 2) {
        output += '.';
        added++;
      }

      for (var i = max_length+1; i >= 0; i--) {
        output += '.';
        added++;
      }

      if (line.multiline_comment) {
        var comment = line.comment.split('\n');

        for (var i = 0; i < comment.length; i++) {
          if (i === 0) {
            output += ' # ' + comment[i] + '\n';
            continue;
          }

          output += '  | '

          if (line.level < 2) {
            output += ' ';
          }

          var multiline_max_length = max_length + line.string.length + line.indentation - added;

          for (var i2 = multiline_max_length; i2 >= 0; i2--) {
            output += ' ';
          }

          for (var i2 = 0; i2 < added; i2++) {
            output += '.';
          }

          output += ' # ' + comment[i];

          if (i !== comment.length) {
            output += '\n';
          }
        }
      } else {
        output += ' # ' + line.comment;
      }
    }

    if (!line.multiline_comment) {
      output += '\n';
    } else {
      output += '  |\n';
    }
  });

  output += '```';

  return output;
};
