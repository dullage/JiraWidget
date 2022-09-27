const { ipcRenderer, shell } = require("electron");
const $ = window.require("jquery");
const fs = window.require("fs");
const joi = window.require("@hapi/joi");
const axios = window.require("axios");

const configSchema = joi
  .object()
  .keys({
    jiraBaseUrl: joi.string().uri().required(),
    username: joi.string(),
    password: joi.string(),
    labels: joi
      .array()
      .items(
        joi.object().keys({
          name: joi.string().min(1).required(),
          jql: joi.string().min(1).required(),
          hideWhenZero: joi.boolean(),
        })
      )
      .min(1)
      .required(),
    anchorRight: joi.boolean(),
    anchorBottom: joi.boolean(),
  })
  .required();

$(function () {
  $(document).bind("keyup", function (e) {
    // Close the app if the escape key is pressed.
    if (e.code == "Escape") {
      ipcRenderer.send("quit");
    }
  });
});

Vue.component("label-count", {
  props: {
    jiraBaseUrl: String,
    username: String,
    password: String,
    name: String,
    jql: String,
    hideWhenZero: {
      type: Boolean,
      default: false,
    },
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
      return encodeURIComponent(this.jql);
    },

    authConfig: function () {
      if (this.username != null && this.password != null) {
        return {
          username: this.username,
          password: this.password,
        };
      } else {
        return null;
      }
    },
  },

  methods: {
    openJiraSearch: function () {
      shell.openExternal(this.jiraBaseUrl + "/issues/?jql=" + this.jqlEncoded);
    },

    updateCount: function () {
      var parent = this;

      var showSpinner = setTimeout(function () {
        parent.updatingCount = true;
      }, 3000);

      axios
        .get(this.jiraBaseUrl + "/rest/api/2/search?jql=" + this.jqlEncoded, {
          auth: this.authConfig,
        })
        .then(function (response) {
          if (parent.count != response.data.total) {
            parent.count = response.data.total;
            parent.$emit("count-updated");
          }
          clearTimeout(showSpinner);
          parent.updatingCount = false;
        })
        .catch(function (error) {
          console.log(error.response);
          // .data.errorMessages
        });
    },
  },

  created: function () {
    this.updateCount();
    this.timer = setInterval(this.updateCount, 60000);
  },
});

var vm = new Vue({
  el: "#app",

  data: {
    config: null,
    configErrors: [],
    resizeTimer: null,
  },

  methods: {
    startResizeTimer: function () {
      parent = this;
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(function () {
        parent.resizeApp();
      }, 200);
    },
    resizeApp: function () {
      let $app = $("#app");
      let appWidth = Math.ceil($app.outerWidth());
      let appHeight = Math.ceil($app.outerHeight());
      ipcRenderer.send(
        "resize",
        appWidth,
        appHeight,
        this.config.anchorRight,
        this.config.anchorBottom
      );
    },
  },

  created: function () {
    // Load the configuration
    var parsedConfig;
    try {
      parsedConfig = JSON.parse(fs.readFileSync("config.json"));
    } catch {
      this.configErrors.push("Unable to load config file. See the docs.");
      return;
    }
    var parent = this;
    configSchema.validate(parsedConfig, function (error) {
      if (error != null) {
        parent.configErrors.push(error);
      }
    });

    this.config = parsedConfig;

    // Auto resize the app if the viewport changes (e.g. when switching resolutions)
    $(window).on("resize", this.startResizeTimer);
  },
});
