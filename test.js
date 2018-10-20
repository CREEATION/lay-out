var layOut = require('./index.js');

// generates "LAY-OUT.md"
layOut('example.lf');

// generates "TEST_OUTPUT.md"
layOut({
  input: 'example.lf',
  output: 'TEST_OUTPUT.md'
});
