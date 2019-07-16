const { ipcRenderer, shell } = require('electron')
const $ = window.require("jquery");
const fs = window.require('fs');

// Load the configuration
var config = JSON.parse(fs.readFileSync("config.json"));

$(function () {
  // Close the app if the escape key is pressed.
  $(document).bind("keyup", "esc", function () {
    ipcRenderer.send('quit');
  });
});

Vue.component("status", {
  props: {
    name: String,
    jql: String
  },
  data: function () {
    return {
      count: null,
      timer: null,
      updatingCount: true,
    };
  },
  computed: {
    jqlEncoded: function() {
      return escape(this.jql);
    }
  },
  methods: {
    resizeApp: function() {
      let $app = $('#app');
      let appWidth = Math.ceil($app.outerWidth());
      let appHeight = Math.ceil($app.outerHeight());
      ipcRenderer.send('resize', appWidth, appHeight);
    },
    openJiraSearch: function () {
      shell.openExternal(config.jiraBaseUrl + '/issues/?jql=' + this.jqlEncoded);
    },
    updateCount: function() {
      var parent = this;

      var showSpinner = setTimeout(function() {
        parent.updatingCount = true;
      }, 1000);

      $.getJSON(config.jiraBaseUrl + '/rest/api/2/search?jql=' + this.jqlEncoded, function(result) {
        parent.count = result.total;
        clearTimeout(showSpinner);
        parent.updatingCount = false;
      });
    }
  },
  created: function() {
    this.updateCount();
    this.timer = setInterval(this.updateCount, 60000);
  },
  mounted: function() {
    this.resizeApp();
  }
});

var vm = new Vue({
  el: "#app",
  data: {
    statuses: config.statuses
  }
});
