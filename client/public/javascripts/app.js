(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("application", function(exports, require, module) {
  module.exports = {
    initialize: function() {
      var Router;
      Router = require('router');
      this.router = new Router();
      Backbone.history.start();
      if (typeof Object.freeze === 'function') {
        return Object.freeze(this);
      }
    }
  };
  
});
window.require.register("initialize", function(exports, require, module) {
  var app;

  app = require('application');

  $(function() {
    require('lib/app_helpers');
    return app.initialize();
  });
  
});
window.require.register("lib/app_helpers", function(exports, require, module) {
  (function() {
    return (function() {
      var console, dummy, method, methods, _results;
      console = window.console = window.console || {};
      method = void 0;
      dummy = function() {};
      methods = 'assert,count,debug,dir,dirxml,error,exception,\
                   group,groupCollapsed,groupEnd,info,log,markTimeline,\
                   profile,profileEnd,time,timeEnd,trace,warn'.split(',');
      _results = [];
      while (method = methods.pop()) {
        _results.push(console[method] = console[method] || dummy);
      }
      return _results;
    })();
  })();
  
});
window.require.register("lib/base_view", function(exports, require, module) {
  var BaseView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = BaseView = (function(_super) {
    __extends(BaseView, _super);

    function BaseView() {
      _ref = BaseView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BaseView.prototype.template = function() {};

    BaseView.prototype.initialize = function() {};

    BaseView.prototype.getRenderData = function() {
      var _ref1;
      return {
        model: (_ref1 = this.model) != null ? _ref1.toJSON() : void 0
      };
    };

    BaseView.prototype.render = function() {
      this.beforeRender();
      this.$el.html(this.template(this.getRenderData()));
      this.afterRender();
      return this;
    };

    BaseView.prototype.beforeRender = function() {};

    BaseView.prototype.afterRender = function() {};

    BaseView.prototype.destroy = function() {
      this.undelegateEvents();
      this.$el.removeData().unbind();
      this.remove();
      return Backbone.View.prototype.remove.call(this);
    };

    return BaseView;

  })(Backbone.View);
  
});
window.require.register("lib/view_collection", function(exports, require, module) {
  var BaseView, ViewCollection, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('lib/base_view');

  module.exports = ViewCollection = (function(_super) {
    __extends(ViewCollection, _super);

    function ViewCollection() {
      this.removeItem = __bind(this.removeItem, this);
      this.addItem = __bind(this.addItem, this);
      _ref = ViewCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ViewCollection.prototype.itemview = null;

    ViewCollection.prototype.views = {};

    ViewCollection.prototype.template = function() {
      return '';
    };

    ViewCollection.prototype.itemViewOptions = function() {};

    ViewCollection.prototype.collectionEl = null;

    ViewCollection.prototype.onChange = function() {
      return this.$el.toggleClass('empty', _.size(this.views) === 0);
    };

    ViewCollection.prototype.appendView = function(view) {
      return this.$collectionEl.append(view.el);
    };

    ViewCollection.prototype.initialize = function() {
      var collectionEl;
      ViewCollection.__super__.initialize.apply(this, arguments);
      this.views = {};
      this.listenTo(this.collection, "reset", this.onReset);
      this.listenTo(this.collection, "add", this.addItem);
      this.listenTo(this.collection, "remove", this.removeItem);
      if (this.collectionEl == null) {
        return collectionEl = el;
      }
    };

    ViewCollection.prototype.render = function() {
      var id, view, _ref1;
      _ref1 = this.views;
      for (id in _ref1) {
        view = _ref1[id];
        view.$el.detach();
      }
      return ViewCollection.__super__.render.apply(this, arguments);
    };

    ViewCollection.prototype.afterRender = function() {
      var id, view, _ref1;
      this.$collectionEl = $(this.collectionEl);
      _ref1 = this.views;
      for (id in _ref1) {
        view = _ref1[id];
        this.appendView(view.$el);
      }
      this.onReset(this.collection);
      return this.onChange(this.views);
    };

    ViewCollection.prototype.remove = function() {
      this.onReset([]);
      return ViewCollection.__super__.remove.apply(this, arguments);
    };

    ViewCollection.prototype.onReset = function(newcollection) {
      var id, view, _ref1;
      _ref1 = this.views;
      for (id in _ref1) {
        view = _ref1[id];
        view.remove();
      }
      return newcollection.forEach(this.addItem);
    };

    ViewCollection.prototype.addItem = function(model) {
      var options, view;
      options = _.extend({}, {
        model: model
      }, this.itemViewOptions(model));
      view = new this.itemview(options);
      this.views[model.cid] = view.render();
      this.appendView(view);
      return this.onChange(this.views);
    };

    ViewCollection.prototype.removeItem = function(model) {
      this.views[model.cid].remove();
      delete this.views[model.cid];
      return this.onChange(this.views);
    };

    return ViewCollection;

  })(BaseView);
  
});
window.require.register("models/configuration", function(exports, require, module) {
  var Configuration, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Configuration = (function(_super) {
    __extends(Configuration, _super);

    function Configuration() {
      _ref = Configuration.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Configuration.prototype.urlRoot = 'configuration';

    return Configuration;

  })(Backbone.Model);
  
});
window.require.register("router", function(exports, require, module) {
  var AppView, Router, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AppView = require('views/app_view');

  module.exports = Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      _ref = Router.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Router.prototype.routes = {
      '': 'main'
    };

    Router.prototype.main = function() {
      var mainView;
      mainView = new AppView();
      return mainView.render();
    };

    return Router;

  })(Backbone.Router);
  
});
window.require.register("views/app_view", function(exports, require, module) {
  var AppView, BaseView, Configuration, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('../lib/base_view');

  Configuration = require('../models/configuration');

  module.exports = AppView = (function(_super) {
    __extends(AppView, _super);

    function AppView() {
      _ref = AppView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AppView.prototype.el = 'body.application';

    AppView.prototype.template = require('./templates/home');

    AppView.prototype.events = {
      'click #save-config': 'onSubmit',
      'click #action-bot': 'onActionBot',
      'click #set-topic': 'onSetTopic',
      'click #set-mode': 'onSetMode'
    };

    AppView.prototype.initialize = function() {
      this.model = new Configuration();
      this.listenTo(this.model, "change", this.onConfigChanged);
      return this.isBotRunning = false;
    };

    AppView.prototype.afterRender = function() {
      this.serverNameField = this.$('#serverName');
      this.usernameField = this.$('#username');
      this.nicknameField = this.$('#nickname');
      this.passwordField = this.$('#password');
      this.channelField = this.$('#channelName');
      this.connectionMessage = this.$('#connectionMessage');
      this.helpMessage = this.$('#helpMessage');
      this.botStatus = this.$('#bot-status');
      this.topic = this.$('#topic');
      this.mode = this.$('#mode');
      this.userTarget = this.$('#user-target');
      this.actionButton = this.$('#action-bot');
      this.setTopicButton = this.$('#set-topic');
      this.setModeButton = this.$('#set-mode');
      this.model.fetch();
      return this.manageSocket();
    };

    AppView.prototype.manageSocket = function() {
      var pathToSocketIO,
        _this = this;
      pathToSocketIO = "" + (window.location.pathname.substring(1)) + "socket.io";
      this.socket = io.connect(window.location.origin, {
        resource: pathToSocketIO
      });
      this.socket.on('get-status', function(data) {
        _this.isBotRunning = data.isRunning;
        _this.topic.val(data.topic);
        if (_this.isBotRunning) {
          _this.botStatus.addClass('bot-started');
          _this.botStatus.removeClass('bot-stopped');
          _this.botStatus.html('running');
          return _this.actionButton.html('Stop');
        } else {
          _this.botStatus.addClass('bot-stopped');
          _this.botStatus.removeClass('bot-started');
          _this.botStatus.html('stopped');
          return _this.actionButton.html('Start');
        }
      });
      return this.socket.emit('ask-status', {});
    };

    AppView.prototype.onActionBot = function() {
      if (this.isBotRunning) {
        this.socket.emit('ask-stop', {});
        return this.actionButton.html('Waiting...');
      } else {
        this.socket.emit('ask-start', {});
        return this.actionButton.html('Waiting...');
      }
    };

    AppView.prototype.onSubmit = function() {
      return this.model.save({
        serverName: this.serverNameField.val(),
        username: this.usernameField.val(),
        nickname: this.nicknameField.val(),
        password: this.passwordField.val(),
        channel: this.channelField.val(),
        connectionMessage: this.connectionMessage.val(),
        helpMessage: this.helpMessage.val(),
        application: 'cozy-irc-botmanager'
      });
    };

    AppView.prototype.onConfigChanged = function() {
      this.serverNameField.val(this.model.get('serverName'));
      this.usernameField.val(this.model.get('username'));
      this.nicknameField.val(this.model.get('nickname'));
      this.passwordField.val(this.model.get('password'));
      this.channelField.val(this.model.get('channel'));
      this.connectionMessage.val(this.model.get('connectionMessage'));
      return this.helpMessage.val(this.model.get('helpMessage'));
    };

    AppView.prototype.onSetTopic = function() {
      return this.socket.emit('set-topic', {
        topic: this.topic.val()
      });
    };

    AppView.prototype.onSetMode = function() {
      this.socket.emit('manage-mode', {
        mode: this.mode.val(),
        user: this.userTarget.val()
      });
      this.mode.val('');
      return this.userTarget.val('');
    };

    return AppView;

  })(BaseView);
  
});
window.require.register("views/templates/home", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="container well"><form class="form-horizontal"><fieldset><legend>Configuration</legend><div class="control-group"><label for="serverName" class="control-label">Server address</label><div class="controls"><input type="text" id="serverName" placeholder="irc.freenode.net"/></div></div><div class="control-group"><label for="username" class="control-label">Username</label><div class="controls"><input type="text" id="username" placeholder="cozy-irc-username"/></div></div><div class="control-group"><label for="nickname" class="control-label">Nickname</label><div class="controls"><input type="text" id="nickname" placeholder="cozy-irc-nickname"/></div></div><div class="control-group"><label for="password" class="control-label">Password (optional)</label><div class="controls"><input type="password" id="password" placeholder="mysecretpassword"/></div></div><div class="control-group"><label for="channelName" class="control-label">Channel name</label><div class="controls"><input type="text" id="channelName" placeholder="#cozycloud"/></div></div><div class="control-group"><label for="connectionMessage" class="control-label">Connection message</label><div class="controls"><input type="text" id="connectionMessage" placeholder="Hello everyone, I\'m a bot !" class="input-xxlarge"/></div></div><div class="control-group"><label for="helpMessage" class="control-label">Help message (!help)</label><div class="controls"><input type="text" id="helpMessage" placeholder="A help message." class="input-xxlarge"/></div></div><button id="save-config" type="button" class="btn">Save</button></fieldset><fieldset><legend>Commands (requires you are channel OP)</legend><div class="control-group"><label for="topic" class="control-label">Bot status</label><div class="controls"><span id="bot-status">stopped</span><button id="action-bot" type="button" class="btn">Start</button></div></div><div class="control-group"><label for="topic" class="control-label">Set topic</label><div class="controls"><input type="text" id="topic" placeholder="A channel topic" class="input-xxlarge"/><button id="set-topic" type="button" class="btn">Set</button></div></div><div class="control-group"><label for="topic" class="control-label">Set mode</label><div class="controls"><input type="text" id="mode" placeholder="+o"/><input type="text" id="user-target" placeholder="username"/><button id="set-mode" type="button" class="btn">Set</button></div></div></fieldset></form></div>');
  }
  return buf.join("");
  };
});
