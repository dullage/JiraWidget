const { ipcRenderer, shell } = require('electron')
const $ = window.require("jquery");
const fs = window.require('fs');

$(function () {
  // Close the app if the escape key is pressed.
  $(document).bind("keyup", "esc", function () {
    ipcRenderer.send('quit');
  });
});

Vue.component("label-count", {
  props: {
    name: String,
    jql: String,
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
    jqlEncoded: function() {
      return escape(this.jql);
    }
  },
  methods: {
    openJiraSearch: function () {
      shell.openExternal(this.jiraBaseUrl + '/issues/?jql=' + this.jqlEncoded);
    },
    updateCount: function() {
      var parent = this;

      var showSpinner = setTimeout(function() {
        parent.updatingCount = true;
      }, 1000);

      $.getJSON(this.jiraBaseUrl + '/rest/api/2/search?jql=' + this.jqlEncoded, function(result) {
        parent.count = result.total;
        clearTimeout(showSpinner);
        parent.updatingCount = false;
      });
    }
  },
  created: function() {
    this.updateCount();
    this.timer = setInterval(this.updateCount, 60000);
  }
});

var vm = new Vue({
  el: "#app",
  data: {
    jiraBaseUrl: null,
    labels: null
  },
  methods: {
    resizeApp: function() {
      let $app = $('#app');
      let appWidth = Math.ceil($app.outerWidth());
      let appHeight = Math.ceil($app.outerHeight());
      ipcRenderer.send('resize', appWidth, appHeight);
    }
  },
  created: function() {
    // Load the configuration
    try {
      let config = JSON.parse(fs.readFileSync("config.json"));
      this.labels = config.labels;
      this.jiraBaseUrl = config.jiraBaseUrl;
    } catch {
      // Do nothing.
    }
  },
  mounted: function() {
    this.resizeApp();
  }
});
