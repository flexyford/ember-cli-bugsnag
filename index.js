/* jshint node: true */
'use strict';

var readEnvironmentConfig = require('./lib/environment-config').read;
var fastbootTransform = require('fastboot-transform');

module.exports = {
  name: 'ember-cli-bugsnag',

  options: {
    nodeAssets: {
      'bugsnag-js': {
        vendor: {
          srcDir: 'src',
          destDir: 'bugsnag-js',
          include: ['bugsnag.js'],

          processTree(input) {
            return fastbootTransform(input);
          }
        }
      }
    }
  },

  config: function() {
    return {
      bugsnag: readEnvironmentConfig(process.env)
    };
  },

  included: function(app) {
    this._super.included.apply(this, arguments);

    app.import('vendor/bugsnag-js/bugsnag.js');
    app.import('vendor/bugsnag/shim.js', {
      type: 'vendor',
      exports: {
        bugsnag: ['default']
      }
    });
  }
};
