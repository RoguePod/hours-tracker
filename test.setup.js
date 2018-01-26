var hook  = require('css-modules-require-hook');
var sass  = require('node-sass');
var jsdom = require('jsdom').jsdom;
var path  = require('path');

var exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window   = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};

hook({
  extensions: ['.scss'],
  preprocessCss: function (css, filepath) {
    var result =  sass.renderSync({
      data: css,
      includePaths: [ path.resolve(__dirname, '../src/stylesheets') ]
    });

    return result.css;
  }
});

function noop() {
    return null;
}

require.extensions['.png'] = noop;
