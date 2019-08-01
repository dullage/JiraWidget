const { ipcRenderer, shell } = require('electron')
const $ = window.require("jquery");
const fs = window.require('fs');
const joi = window.require('@hapi/joi');

const configSchema = joi.object().keys({
  jiraBaseUrl: joi.string().uri().required(),
  labels: joi.array().items(joi.object().keys({
    name: joi.string().min(1).required(),
    jql: joi.string().min(1).required(),
    hideWhenZero: joi.boolean()
  })).min(1).required(),
  anchorRight: joi.boolean(),
  anchorBottom: joi.boolean()
}).required()

$(function () {
  $(document).bind('keyup', function (e) {
    // Close the app if the escape key is pressed.
    if (e.code == 'Escape') {
      ipcRenderer.send('quit');
    }
  });
});

Vue.component("label-count", {
  props: {
    jql: String,
    name: String,
    hideWhenZero: {
      type: Boolean,
      default: false
    },
    jiraBaseUrl: String
  },
  data: function () {
    return {
      count: null,
      timer: null,
      updatingCount: true,
    };
  },
  computed: {
    jqlEncoded: function () {
      return escape(this.jql);
    }
  },
  methods: {
    openJiraSearch: function () {
      shell.openExternal(this.jiraBaseUrl + '/issues/?jql=' + this.jqlEncoded);
    },
    updateCount: function () {
      var parent = this;

      var showSpinner = setTimeout(function () {
        parent.updatingCount = true;
      }, 3000);

      $.getJSON(this.jiraBaseUrl + '/rest/api/2/search?jql=' + this.jqlEncoded, function (result) {
        parent.count = result.total;
        clearTimeout(showSpinner);
        parent.updatingCount = false;

        // Resize the app as some of the labels might now be hidden / shown
        parent.$parent.resizeApp();
      });
    }
  },
  created: function () {
    this.updateCount();
    this.timer = setInterval(this.updateCount, 60000);
  }
});

var vm = new Vue({
  el: "#app",
  data: {
    config: null,
    configErrors: []
  },
  methods: {
    resizeApp: function () {
      // Turn off auto resizing whilst we resize
      $(window).off('resize')

      let $app = $('#app');
      let appWidth = Math.ceil($app.outerWidth());
      let appHeight = Math.ceil($app.outerHeight());
      ipcRenderer.send('resize', appWidth, appHeight, this.config.anchorRight, this.config.anchorBottom);

      // Auto resize the app if the viewport changes (e.g. when switching resolutions)
      $(window).on('resize', this.resizeApp)
    }
  },
  created: function () {
    // Load the configuration
    var parsedConfig;
    try {
      parsedConfig = JSON.parse(fs.readFileSync("config.json"));
    } catch {
      this.configErrors.push('Unable to load config file. See the docs.');
      return;
    }
    var parent = this;
    configSchema.validate(parsedConfig, function (error) {
      if (error != null) {
        parent.configErrors.push(error);
      }
    })

    this.config = parsedConfig;
  },
  mounted: function () {
    this.resizeApp();
  }
});
