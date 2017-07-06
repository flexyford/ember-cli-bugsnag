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

  config: function(env, config) {
    const { bugsnag } = config;
    const { notifyReleaseStages , releaseStage = env } = bugsnag;

    this._includeBugsnag = this.isDevelopingAddon() || notifyReleaseStages.includes(releaseStage);

    return {
      bugsnag: readEnvironmentConfig(process.env)
    };
  },

  treeForAddon: function() {
    if (this._includeBugsnag) {
      return this._super.treeForAddon.apply(this, arguments);
    }
  },

  treeForApp: function() {
    if (this._includeBugsnag) {
      return this._super.treeForApp.apply(this, arguments);
    }
  },

  included: function(app) {
    this._super.included.apply(this, arguments);

    if (this._includeBugsnag) {
      app.import('vendor/bugsnag-js/bugsnag.js');

      app.import('vendor/bugsnag/shim.js', {
        type: 'vendor',
        exports: {
          bugsnag: ['default']
        }
      });
    }
  }
};
