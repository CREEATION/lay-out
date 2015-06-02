var settings = require('./settings.js');

exports.get = function (array) {
  var output = '# ';

  if (array[0].comment) {
    output += array[0].comment;
    array[0].comment = false;
  } else {
    output += 'lay-out';
  }

  output += '\n```\n';

  Object.keys(array).forEach(function (key) {
    var line = '';
    var indentation = array[key].level * settings.get('indentation_level');

    for (var i = indentation - 1; i >= 0; i--) {
      line += ' ';
    }

    line += array[key].string;

    if (array[key].comment) {
      var max_length = settings.get('line_maxlength') - array[key].string.length - array[key].indentation;

      line += ' ';

      for (var i = max_length - 1; i >= 0; i--) {
        line += '.';
      }

      line += '.. # ' + array[key].comment;
    }

    output += line + '\n';
  });

  output += '\n```';

  return output;
};
