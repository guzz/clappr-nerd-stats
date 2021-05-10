import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';
import _inherits from '@babel/runtime/helpers/inherits';
import _possibleConstructorReturn from '@babel/runtime/helpers/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/getPrototypeOf';
import { template, Events, Styler, UICorePlugin } from '@clappr/core';
import ClapprStats from '@guzzj/clappr-stats-plugin';
import get from 'lodash.get';
import cloneDeep from 'lodash.clonedeep';
import merge from 'lodash.merge';
import Mousetrap from 'mousetrap';
import humanFormat from 'human-format';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".clappr-nerd-stats[data-clappr-nerd-stats] .stats-box {\n  position: absolute;\n  display: inline-block;\n  overflow: hidden;\n  top: 5px;\n  left: 5px;\n  padding: 5px 5px 5px 5px;\n  margin: 0;\n  line-height: 20px;\n  font-size: 11px;\n  box-shadow: 0 0 0 1px hsla(0, 0%, 100%, 0.15);\n  background: rgba(0, 0, 0, 0.8);\n  color: #fff;\n  z-index: 999;\n  width: 260px;\n  max-height: 300px;\n  border-radius: 4px;\n  transition: opacity .2s ease .1s, width .3s ease, max-height .3s ease;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box.hidden {\n  transition: opacity .2s ease .1s, width .3s ease, max-height .3s ease;\n  width: 30px;\n  max-height: 30px;\n  z-index: 0;\n  opacity: 0;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box div,\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box ul,\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box a {\n  transition: opacity .1s ease .2s;\n  opacity: 1;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box.hidden div,\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box.hidden ul,\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box.hidden a {\n  transition: opacity .1s ease;\n  opacity: 0;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .nerd-title {\n  font-size: 14px;\n  font-family: sans-serif;\n  font-weight: 100 !important;\n  letter-spacing: 1px;\n  border-bottom: 1px solid rgba(255, 255, 255, .3);\n  padding-bottom: 4px;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .general {\n  display: flex;\n  flex-wrap: wrap;\n  flex: 1 1 auto;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .general .general-metric {\n  flex: 0 0 50%;\n  flex-basis: 0;\n  flex-grow: 1;\n  max-width: 50%;\n  width: 50%;\n  padding: 8px;\n  text-align: center;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .general .general-metric .metric {\n  font-size: 20px;\n  letter-spacing: 1px;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .general .general-metric .metric-title {\n  font-size: 8px;\n  letter-spacing: 1px;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .metric-selector {\n  display: flex;\n  flex-wrap: wrap;\n  flex: 1 1 auto;\n  margin-bottom: 4px;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .metric-selector .metric-selector-item {\n  flex-basis: 0;\n  flex-grow: 1;\n  max-width: 100%;\n  padding: 0 4px;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .metric-selector .metric-selector-item a {\n  text-decoration: none;\n  letter-spacing: 1px;\n  color: white;\n  width: 100%;\n  font-size: 10px;\n  display: block;\n  text-transform: uppercase;\n  border-radius: 2px;\n  background: transparent;\n  transition: background .2s ease;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .metric-selector .metric-selector-item a:hover {\n  background: rgba(255, 255, 255, .1);\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .metric-selector .metric-selector-item a.active {\n  background: rgba(255, 255, 255, .3);\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .stats {\n  position: relative;\n  overflow-y: hidden;\n  overflow-x: hidden;\n  max-height: 190px;\n  padding: 5px 5px 5px 5px;\n  width: 100%;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .stats.scroll {\n  padding: 5px 10px 5px 5px;\n  width: 109%;\n  overflow-y: auto;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .stats ul {\n  float: left;\n  width: 100%;\n  overflow-y: auto;\n  display: none;\n  transition: transform .2s ease;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .stats ul.current,\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .stats ul.enter {\n  display: block;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .stats ul.enter {\n  position: absolute;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .stats ul.enter.reverse,\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .stats ul.leave.forward {\n  transform: translateX(-105%);\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .stats ul.enter.forward,\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .stats ul.leave.reverse {\n  transform: translateX(105%);\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .stats ul, li {\n  list-style-type: none;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .stats li:nth-child(2n) {\n  background: hsla(0, 0%, 100%, 0.15);\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .stats li {\n  padding: 0 5px;\n  text-align: left;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .stats li.title {\n  text-align: center;\n  font-weight: bold;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box .stats li div {\n  padding-left: 5px;\n  margin: 0;\n  float: right;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box a.close-button {\n  position: absolute;\n  right: 0.3em;\n  top: 5px;\n  font-size: 24px;\n  cursor: pointer;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .icon-show-stats {\n  display: none;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .icon-show-stats.ready {\n  display: block;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .icon-show-stats svg {\n  z-index: 1000;\n  position: absolute;\n  float: right;\n  color: white;\n  display: none;\n  width: 30px;\n  height: 30px;\n  cursor: pointer;\n  opacity: .6;\n  transition: opacity .2s ease;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .icon-show-stats.hide-button svg {\n  opacity: .0;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .icon-show-stats svg:hover {\n  opacity: .8;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .icon-show-stats.active svg, .clappr-nerd-stats[data-clappr-nerd-stats] .icon-show-stats.hide-button.active svg {\n  opacity: 1;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .icon-show-stats.top-right svg {\n  display: block;\n  top: 5px;\n  right: 10px;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .icon-show-stats.top-left svg {\n  display: block;\n  top: 5px;\n  left: 10px;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .icon-show-stats.bottom-right svg {\n  display: block;\n  right: 10px;\n  bottom: 5px;\n}\n\n.clappr-nerd-stats[data-clappr-nerd-stats] .icon-show-stats.bottom-left svg {\n  display: block;\n  bottom: 5px;\n  left: 10px;\n}\n";
styleInject(css_248z);

var pluginHtml = "<% general = metrics.general %>\n\n<div class=\"icon-show-stats <%= buttonIsShowing ? '' : 'hide-button' %> <%= iconPosition %> <%= isActive %> <%= isReady ? 'ready' : '' %>\" data-show-stats-button>\n  <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 50 50\" height=\"50\" width=\"50\">\n    <defs id=\"defs26\">\n      <filter style=\"color-interpolation-filters:sRGB;\" inkscape:label=\"Drop Shadow\" id=\"filter924\">\n        <feFlood flood-opacity=\"0.498039\" flood-color=\"rgb(0,0,0)\" result=\"flood\" id=\"feFlood914\"/>\n        <feComposite in=\"flood\" in2=\"SourceGraphic\" operator=\"in\" result=\"composite1\" id=\"feComposite916\"/>\n        <feGaussianBlur in=\"composite1\" stdDeviation=\"3\" result=\"blur\" id=\"feGaussianBlur918\"/>\n        <feOffset dx=\"0\" dy=\"0\" result=\"offset\" id=\"feOffset920\"/>\n        <feComposite in=\"SourceGraphic\" in2=\"offset\" operator=\"over\" result=\"composite2\" id=\"feComposite922\"/>\n      </filter>\n    </defs>\n    <path id=\"path20\" style=\"fill:#ffffff;fill-opacity:1;stroke-width:0.857712;filter:url(#filter924)\" d=\"m 16.21416,8.6896525 c -5.491328,0 -9.8837771,4.3947995 -9.8837771,9.8861285 0,2.638942 0.6337291,4.876394 2.2828618,7.347002 h 6.4018843 l 3.178607,-11.861002 a 1.2038534,1.2038534 0 0 1 1.116746,-0.891045 1.2038534,1.2038534 0 0 1 1.208434,0.891045 l 4.631551,17.291907 3.166852,-11.816332 a 1.2038534,1.2038534 0 0 1 2.320478,-0.01645 l 1.824408,6.401884 h 8.924551 c 1.649132,-2.470608 2.282861,-4.70806 2.282861,-7.347002 0,-5.491329 -4.392449,-9.8861285 -9.883777,-9.8861285 -4.502887,0 -7.028616,2.5277165 -8.78584,4.5045945 -1.757224,-1.976878 -4.282953,-4.5045945 -8.78584,-4.5045945 z m 3.140991,10.3328245 -2.254648,8.414378 a 1.2038534,1.2038534 0 0 1 -1.161415,0.893395 h -5.463819 c 2.766077,3.176431 7.144541,6.95864 13.86644,12.429954 L 25,41.310347 25.658291,40.760204 C 32.38019,35.28889 36.758654,31.506681 39.524731,28.330249 h -7.97238 A 1.2038534,1.2038534 0 0 1 30.39564,27.455663 l -0.879291,-3.089269 -3.202117,11.950342 a 1.2038534,1.2038534 0 0 1 -2.32518,0 z\"/>\n  </svg>\n</div>\n\n<div class=\"stats-box <%= isBoxActive %>\">\n  <a class=\"close-button\" data-close-button>&times;</a>\n  <div class=\"nerd-title\">\n    <%= nerdTitle %>\n  </div>\n  <div class=\"general\">\n    <div class=\"general-metric\">\n      <div class=\"metric\">\n        <%= general.displayResolution %>\n      </div>\n      <div class=\"metric-title\">\n        resolution\n      </div>\n    </div>\n    <div class=\"general-metric\">\n      <div class=\"metric\">\n        <%= general.volume %>\n      </div>\n      <div class=\"metric-title\">\n        volume\n      </div>\n    </div>\n  </div>\n  <div>\n    <div class=\"metric-selector\">\n      <% for (let i = 0; i < Object.keys(metrics).length; i++) { %>\n        <% if (Object.keys(metrics)[i] !== 'general') { %>\n          <div class=\"metric-selector-item\">\n            <a href=\"#\" class=\"<%= selectedMetricsType === i ? 'active' : '' %>\" data-metric-selector-select=\"<%=i %>\">\n              <%= metricLabels[Object.keys(metrics)[i]].label %>\n            </a>\n          </div>\n        <% }; %>\n      <% }; %>\n    </div>\n  </div>\n\n  <div class=\"stats <%= statsScroll ? 'scroll' : '' %>\">\n    <% for (let i = 0; i < Object.keys(metrics).length; i++) { %>\n      <% if (Object.keys(metrics)[i] !== 'general') { %>\n        <% metricType = Object.keys(metrics)[i] %>\n        <ul id=\"list-<%= i %>\" class=\"<%= selectedMetricsType === i ? 'current' : '' %>\">\n          <% for (let a = 0; a < Object.keys(metrics[metricType]).length; a++) { %>\n            <% metric = Object.keys(metrics[metricType])[a] %>\n            <li>\n              <%= metricLabels[metricType].metrics[metric].label %>\n              <%= metricLabels[metricType].metrics[metric].separator %>\n              <div><span><%= metrics[metricType][metric] %></span></div>\n            </li>\n          <% }; %>\n        </ul>\n      <% }; %>\n    <% }; %>\n  </div>\n</div>\n";

var timeScale = new humanFormat.Scale({
  ms: 1,
  sec: 1000,
  min: 60000,
  hours: 3600000
});
var percentScale = new humanFormat.Scale({
  '%': 1
});
var formattingTemplate = {
  general: {
    volume: {
      scale: percentScale
    }
  },
  timers: {
    startup: {
      scale: timeScale
    },
    watch: {
      scale: timeScale
    },
    pause: {
      scale: timeScale
    },
    buffering: {
      scale: timeScale
    },
    session: {
      scale: timeScale
    },
    latency: {
      scale: timeScale
    }
  },
  extra: {
    buffersize: {
      scale: timeScale
    },
    duration: {
      scale: timeScale
    },
    currentTime: {
      scale: timeScale
    },
    bitrateWeightedMean: {
      unit: 'bps'
    },
    bitrateMostUsed: {
      unit: 'bps'
    },
    bandwidth: {
      unit: 'bps'
    },
    watchedPercentage: {
      scale: percentScale
    },
    bufferingPercentage: {
      scale: percentScale
    }
  }
};

var Formatter = /*#__PURE__*/function () {
  function Formatter() {
    _classCallCheck(this, Formatter);
  }

  _createClass(Formatter, null, [{
    key: "format",
    value: function format(metrics) {
      var formattedMetrics = {};
      Object.keys(metrics).forEach(function (type) {
        formattedMetrics[type] = {};
        var typeTemplate = formattingTemplate[type];
        Object.keys(metrics[type]).forEach(function (name) {
          var value = metrics[type][name];

          if (typeTemplate && typeTemplate[name] && typeof value === 'number' && !isNaN(value)) {
            var templateScale = typeTemplate[name].scale || 'SI';
            var templateUnit = typeTemplate[name].unit || '';
            formattedMetrics[type][name] = humanFormat(value, {
              scale: templateScale,
              unit: templateUnit,
              decimals: 2
            });
          } else {
            formattedMetrics[type][name] = value;
          }
        });
      });
      return formattedMetrics;
    }
  }]);

  return Formatter;
}();

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var METRICS_LABELS = {
  general: {
    label: 'General',
    metrics: {
      displayResolution: {
        label: 'resolution'
      },
      volume: {
        label: 'volume'
      }
    }
  },
  counters: {
    label: 'Counters',
    metrics: {
      play: {
        label: 'Plays',
        separator: ': '
      },
      pause: {
        label: 'Pauses',
        separator: ': '
      },
      error: {
        label: 'Errors',
        separator: ': '
      },
      buffering: {
        label: 'Bufferings',
        separator: ': '
      },
      decodedFrames: {
        label: 'Decoded frames',
        separator: ': '
      },
      droppedFrames: {
        label: 'Dropped frames',
        separator: ': '
      },
      fps: {
        label: 'Frames per second',
        separator: ': '
      },
      changeLevel: {
        label: 'Bitrate changes',
        separator: ': '
      },
      seek: {
        label: 'Seeks',
        separator: ': '
      },
      fullscreen: {
        label: 'Fullscreen',
        separator: ': '
      },
      dvrUsage: {
        label: 'DVR seeks',
        separator: ': '
      }
    }
  },
  timers: {
    label: 'Timers',
    metrics: {
      startup: {
        label: 'Startup time',
        separator: ': '
      },
      watch: {
        label: 'Watching time',
        separator: ': '
      },
      pause: {
        label: 'Pause time',
        separator: ': '
      },
      buffering: {
        label: 'Buffering time',
        separator: ': '
      },
      session: {
        label: 'Session time',
        separator: ': '
      },
      latency: {
        label: 'Latency',
        separator: ': '
      }
    }
  },
  extra: {
    label: 'Extras',
    metrics: {
      playbackName: {
        label: 'Playback',
        separator: ': '
      },
      playbackType: {
        label: 'Playback type',
        separator: ': '
      },
      buffersize: {
        label: 'Buffer size',
        separator: ': '
      },
      duration: {
        label: 'Video duration',
        separator: ': '
      },
      currentTime: {
        label: 'Current time',
        separator: ': '
      },
      bitratesHistory: {
        label: 'Session time',
        separator: ': '
      },
      bitrateWeightedMean: {
        label: 'Bitrate weighted mean',
        separator: ': '
      },
      bitrateMostUsed: {
        label: 'Bitrate most used',
        separator: ': '
      },
      watchHistory: {
        label: 'Watch History',
        separator: ': '
      },
      watchedPercentage: {
        label: '% Watched',
        separator: ': '
      },
      bufferingPercentage: {
        label: '% Buffering',
        separator: ': '
      },
      bandwidth: {
        label: 'Bandwidth',
        separator: ': '
      }
    }
  }
};

var ClapprNerdStats = /*#__PURE__*/function (_UICorePlugin) {
  _inherits(ClapprNerdStats, _UICorePlugin);

  var _super = _createSuper(ClapprNerdStats);

  function ClapprNerdStats(core) {
    var _this;

    _classCallCheck(this, ClapprNerdStats);

    _this = _super.call(this, core);
    _this._shortcut = get(core, 'options.clapprNerdStats.shortcut', ['command+shift+s', 'ctrl+shift+s']);
    _this._iconPosition = get(core, 'options.clapprNerdStats.iconPosition', 'top-right');
    _this._nerdTitle = get(core, 'options.clapprNerdStats.nerdTitle', 'Nerd Stats');
    var optionsMetricLabels = get(core, 'options.clapprNerdStats.metricLabels', {});
    _this.metrics = {};
    _this.selectedMetricsType = 0;
    _this.metricLabels = merge(METRICS_LABELS, optionsMetricLabels);
    _this.statsScroll = true;
    _this.isReady = false;
    _this.buttonIsShowing = false;
    _this._Mousetrap = new Mousetrap(window);
    return _this;
  }

  _createClass(ClapprNerdStats, [{
    key: "name",
    get: function get() {
      return 'clappr-nerd-stats';
    }
  }, {
    key: "template",
    get: function get() {
      return template(pluginHtml);
    }
  }, {
    key: "attributes",
    get: function get() {
      return {
        'data-clappr-nerd-stats': '',
        'class': 'clappr-nerd-stats'
      };
    }
  }, {
    key: "events",
    get: function get() {
      return {
        'click [data-show-stats-button]': 'showOrHide',
        'click [data-close-button]': 'hide',
        'click [data-metric-selector-select]': 'selectStatsType'
      };
    }
  }, {
    key: "statsBoxElem",
    get: function get() {
      return '.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box';
    }
  }, {
    key: "statsIconElem",
    get: function get() {
      return '.clappr-nerd-stats[data-clappr-nerd-stats] .icon-show-stats';
    }
  }, {
    key: "statsBoxWidthThreshold",
    get: function get() {
      return 720;
    }
  }, {
    key: "playerWidth",
    get: function get() {
      return this.core.currentSize.width;
    }
  }, {
    key: "playerHeight",
    get: function get() {
      return this.core.currentSize.height;
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      this.listenToOnce(this.core, Events.CORE_READY, this.init);
    }
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;

      this.container = this.core.getCurrentContainer();
      var clapprStats = this.container.getPlugin('clappr_stats');
      this.listenTo(this.container, Events.CONTAINER_MEDIACONTROL_HIDE, this.hideButton);
      this.listenTo(this.container, Events.CONTAINER_MEDIACONTROL_SHOW, this.showButton);

      if (typeof clapprStats === 'undefined') {
        console.error('clappr-stats not available. Please, include it as a plugin of your Clappr instance.\n' + 'For more info, visit: https://github.com/clappr/clappr-stats.');
        this.disable();
      } else {
        this._Mousetrap.bind(this._shortcut, function () {
          return _this2.showOrHide();
        });

        this.listenTo(this.container, Events.PLAYER_RESIZE, this.onPlayerResize);
        this.listenTo(this.container, Events.PLAYER_FULLSCREEN, this.onPlayerResize);
        this.listenTo(clapprStats, ClapprStats.REPORT_EVENT, this.updateMetrics);
        this.updateMetrics(clapprStats._metrics);
        this.render();
      }
    }
  }, {
    key: "showOrHide",
    value: function showOrHide(event) {
      if (this.showing) {
        this.hide(event);
      } else {
        this.show(event);
      }
    }
  }, {
    key: "show",
    value: function show(event) {
      this.core.$el.find(this.statsBoxElem).removeClass('hidden');
      this.core.$el.find(this.statsIconElem).addClass('active');
      this.showing = true;

      if (event) {
        event.stopPropagation();
      }
    }
  }, {
    key: "hide",
    value: function hide(event) {
      this.core.$el.find(this.statsBoxElem).addClass('hidden');
      this.core.$el.find(this.statsIconElem).removeClass('active');
      this.showing = false;

      if (event) {
        event.stopPropagation();
      }
    }
  }, {
    key: "hideButton",
    value: function hideButton() {
      this.core.$el.find(this.statsIconElem).addClass('hide-button');
      this.buttonIsShowing = false;
    }
  }, {
    key: "showButton",
    value: function showButton() {
      var iconElement = this.core.$el.find(this.statsIconElem);

      if (!iconElement.hasClass('ready') && !this.isReady) {
        iconElement.addClass('ready');
        this.isReady = true;
      }

      this.core.$el.find(this.statsIconElem).removeClass('hide-button');
      this.buttonIsShowing = true;
    }
  }, {
    key: "selectStatsType",
    value: function selectStatsType(event) {
      var selectedMetricsType = parseInt(event.target.dataset.metricSelectorSelect);
      if (selectedMetricsType === this.selectedMetricsType) return false;
      var oldButton = this.core.$el.find(this.statsBoxElem).find('.metric-selector-item a');
      var clickedButton = this.core.$el.find(this.statsBoxElem).find(event.target);
      var oldStatsList = this.core.$el.find(this.statsBoxElem).find('#list-' + this.selectedMetricsType);
      var newStatsList = this.core.$el.find(this.statsBoxElem).find('#list-' + selectedMetricsType);
      oldButton.removeClass('active');
      clickedButton.addClass('active');
      this.animateListChange(oldStatsList, newStatsList, selectedMetricsType < this.selectedMetricsType);
      this.selectedMetricsType = selectedMetricsType;
      event.stopPropagation();
      return false;
    }
  }, {
    key: "animateListChange",
    value: function animateListChange(oldStatsList, newStatsList, reverse) {
      newStatsList.addClass(reverse ? 'reverse' : 'forward');
      oldStatsList.addClass(reverse ? 'reverse' : 'forward');
      newStatsList.addClass('enter');
      oldStatsList.addClass('leave');
      var newListHeight = newStatsList[0].clientHeight;
      var statsBox = this.core.$el.find(this.statsBoxElem).find('.stats');

      if (newListHeight > 190 && !statsBox.hasClass('scroll')) {
        statsBox.addClass('scroll');
        this.statsScroll = true;
      } else if (newListHeight < 190 && statsBox.hasClass('scroll')) {
        statsBox.removeClass('scroll');
        this.statsScroll = false;
      }

      setTimeout(function () {
        oldStatsList.removeClass('current');
        oldStatsList.removeClass('leave');
        oldStatsList.removeClass(reverse ? 'reverse' : 'forward');
        newStatsList.removeClass(reverse ? 'reverse' : 'forward');
        newStatsList.addClass('current');
        newStatsList.removeClass('enter');
      }, 200);
    }
  }, {
    key: "onPlayerResize",
    value: function onPlayerResize() {
      this.setStatsBoxSize();
    }
  }, {
    key: "addGeneralMetrics",
    value: function addGeneralMetrics() {
      this.metrics.general = {
        displayResolution: this.playerWidth + 'x' + this.playerHeight,
        volume: this.container.volume
      };
    }
  }, {
    key: "updateMetrics",
    value: function updateMetrics(metrics) {
      this.metrics = cloneDeep(metrics);
      this.addGeneralMetrics();
      var scrollTop = this.core.$el.find(this.statsBoxElem).scrollTop();
      this.$el.html(this.template({
        metrics: Formatter.format(this.metrics),
        iconPosition: this._iconPosition,
        isActive: this.showing ? 'active' : '',
        isBoxActive: this.showing ? '' : 'hidden',
        nerdTitle: this._nerdTitle,
        metricLabels: this.metricLabels,
        selectedMetricsType: this.selectedMetricsType,
        statsScroll: this.statsScroll,
        isReady: this.isReady,
        buttonIsShowing: this.buttonIsShowing
      }));
      this.setStatsBoxSize();
      this.core.$el.find(this.statsBoxElem).scrollTop(scrollTop);

      if (!this.showing) {
        this.hide();
      }
    }
  }, {
    key: "setStatsBoxSize",
    value: function setStatsBoxSize() {
      if (this.playerWidth >= this.statsBoxWidthThreshold) {
        this.$el.find(this.statsBoxElem).addClass('wide');
        this.$el.find(this.statsBoxElem).removeClass('narrow');
      } else {
        this.$el.find(this.statsBoxElem).removeClass('wide');
        this.$el.find(this.statsBoxElem).addClass('narrow');
      }
    }
  }, {
    key: "render",
    value: function render() {
      var style = Styler.getStyleFor(css_248z, {
        baseUrl: this.options.baseUrl
      });
      this.core.$el.append(style[0]);
      this.core.$el.append(this.$el[0]);
      this.hide();
      return this;
    }
  }]);

  return ClapprNerdStats;
}(UICorePlugin);

export default ClapprNerdStats;
