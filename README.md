# lay-out
static project structure visualizer.

> Example files included in this repository.

## Atom & Sublime Text Syntax Highlighting
https://github.com/CREEATION/lay-out-syntax

## Usage

Basic:

```javascript
var layOut = require('lay-out');

layOut('example.lf');
```

Custom filename:

```javascript
var layOut = require('lay-out');

layOut({
  input: 'example.lf',
  output: 'TEST.md'
});
```

## Example output

# alrighty
```
+ nothing/
  | README.md .............................. # What is this all about?
  | .htaccess .............................. # .htaccess stuff
  | app.sass ............................... # main sass file
  | fonts.sass
  + base/
  +   icons/
  |   | README
  |   | styles.sass
  |   | template.jade ...................... # use those icons
  +   sprites/
  |   + img/
  |     + sprites/ ......................... # nice sprites
  |       + main/
  |         | logo.png ..................... # lol
  |         | footer.bmp ................... # bmp is so cool
  |         + surprisefolder/
  |           | header.png
  |           | header2.swf
  |         | button.gif
  |     | sprite.png
  |     | _auto-generated_sprites.sass
  +   typography/ .......................... # these fonts look awesome
  |   | styles.sass
  + javascript/
  +   app/ ................................. # app specific js
  |   + portfolio/
  |     | 01_plugins.js
  |     | 02_nav.js
  |     | 03_modal.js
  |     | init.js .......................... # my body is ready
  +   lib/ ................................. # third-party scripts
  |   | bootstrap.min.js ................... # v3.3.4
  |   | html5shiv.min.js ................... # v3.7.2
  |   | jquery.min.js ...................... # v2.1.4
```

### TO-DO
- Multi-line comments support for output
- Invisible comments in output (which are currently the multi-line ones)
- Make sure it's not a bug that multi-lines don't show up :turtle:
- Probably refactor stuff
