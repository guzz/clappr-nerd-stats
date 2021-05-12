import { UICorePlugin, Events, Styler, template, version } from '@guzzj/clappr-core'
import ClapprStats from '@guzzj/clappr-stats-plugin'
import pluginStyle from './public/clappr-nerd-stats.css'
import pluginHtml from './public/clappr-nerd-stats.html'
import get from 'lodash.get'
import cloneDeep from 'lodash.clonedeep'
import merge from 'lodash.merge'
import Mousetrap from 'mousetrap'
import Formatter from './formatter'

const METRICS_LABELS = {
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
      },
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
      },
    }
  }
}

export default class ClapprNerdStats extends UICorePlugin {
  get name() { return 'clappr-nerd-stats' }
  get template() { return template(pluginHtml) }

  get supportedVersion() { return { min: version } }

  get attributes() {
    return {
      'data-clappr-nerd-stats': '',
      'class': 'clappr-nerd-stats'
    }
  }

  get events() {
    return {
      'click [data-show-stats-button]': 'showOrHide',
      'click [data-close-button]': 'hide',
      'click [data-metric-selector-select]': 'selectStatsType'
    }
  }

  get statsBoxElem() { return '.clappr-nerd-stats[data-clappr-nerd-stats] .stats-box' }
  get statsIconElem() { return '.clappr-nerd-stats[data-clappr-nerd-stats] .icon-show-stats' }
  get statsBoxWidthThreshold() { return 720 }

  get playerWidth() { return this.core.currentSize.width }
  get playerHeight() { return this.core.currentSize.height }

  constructor(core) {
    super(core)
    this._shortcut = get(core, 'options.clapprNerdStats.shortcut', ['command+shift+s', 'ctrl+shift+s'])
    this._iconPosition = get(core, 'options.clapprNerdStats.iconPosition', 'top-right')
    this._nerdTitle = get(core, 'options.clapprNerdStats.nerdTitle', 'Nerd Stats')
    const optionsMetricLabels = get(core, 'options.clapprNerdStats.metricLabels', {})
    this.metrics = {}
    this.selectedMetricsType = 0
    this.metricLabels = merge(METRICS_LABELS, optionsMetricLabels)
    this.statsScroll = true
    this.isReady = false
    this.buttonIsShowing = false
    this._Mousetrap = new Mousetrap(window)
  }

  bindEvents() {
    this.listenToOnce(this.core, Events.CORE_READY, this.init)
  }

  init() {
    this.container = this.core.getCurrentContainer()
    const clapprStats = this.container.getPlugin('clappr_stats')
    this.listenTo(this.container, Events.CONTAINER_MEDIACONTROL_HIDE, this.hideButton)
    this.listenTo(this.container, Events.CONTAINER_MEDIACONTROL_SHOW, this.showButton)
    if (typeof clapprStats === 'undefined') {
      console.error('clappr-stats not available. Please, include it as a plugin of your Clappr instance.\n' +
                    'For more info, visit: https://github.com/clappr/clappr-stats.')
      this.disable()
    } else {
      this._Mousetrap.bind(this._shortcut, () => this.showOrHide())
      this.listenTo(this.container, Events.PLAYER_RESIZE, this.onPlayerResize)
      this.listenTo(this.container, Events.PLAYER_FULLSCREEN, this.onPlayerResize)
      this.listenTo(clapprStats, ClapprStats.REPORT_EVENT, this.updateMetrics)
      this.updateMetrics(clapprStats._metrics)
      this.render()
    }
  }

  showOrHide(event) {
    if (this.showing) {
      this.hide(event)
    } else {
      this.show(event)
    }
  }

  show(event) {
    this.core.$el.find(this.statsBoxElem).removeClass('hidden')
    this.core.$el.find(this.statsIconElem).addClass('active')
    this.showing = true
    if (event) {
      event.stopPropagation()
    }
  }

  hide(event) {
    this.core.$el.find(this.statsBoxElem).addClass('hidden')
    this.core.$el.find(this.statsIconElem).removeClass('active')
    this.showing = false
    if (event) {
      event.stopPropagation()
    }
  }

  hideButton() {
    this.core.$el.find(this.statsIconElem).addClass('hide-button')
    this.buttonIsShowing = false
  }
  
  showButton() {
    const iconElement = this.core.$el.find(this.statsIconElem)
    if (!iconElement.hasClass('ready') && !this.isReady) {
      iconElement.addClass('ready')
      this.isReady = true
    }
    this.core.$el.find(this.statsIconElem).removeClass('hide-button')
    this.buttonIsShowing = true
  }

  selectStatsType(event) {
    const selectedMetricsType = parseInt(event.target.dataset.metricSelectorSelect)
    if (selectedMetricsType === this.selectedMetricsType) return false
    const oldButton = this.core.$el.find(this.statsBoxElem).find('.metric-selector-item a')
    const clickedButton = this.core.$el.find(this.statsBoxElem).find(event.target)
    const oldStatsList = this.core.$el.find(this.statsBoxElem).find('#list-' + this.selectedMetricsType)
    const newStatsList = this.core.$el.find(this.statsBoxElem).find('#list-' + selectedMetricsType)
    oldButton.removeClass('active')
    clickedButton.addClass('active')
    this.animateListChange(oldStatsList, newStatsList, selectedMetricsType < this.selectedMetricsType)
    this.selectedMetricsType = selectedMetricsType
    event.stopPropagation()
    return false
  }

  animateListChange(oldStatsList, newStatsList, reverse) {
    newStatsList.addClass(reverse ? 'reverse' : 'forward')
    oldStatsList.addClass(reverse ? 'reverse' : 'forward')
    newStatsList.addClass('enter')
    oldStatsList.addClass('leave')
    const newListHeight = newStatsList[0].clientHeight
    const statsBox = this.core.$el.find(this.statsBoxElem).find('.stats')
    if (newListHeight > 190 && !statsBox.hasClass('scroll')) {
      statsBox.addClass('scroll')
      this.statsScroll = true
    } else if (newListHeight < 190 && statsBox.hasClass('scroll')) {
      statsBox.removeClass('scroll')
      this.statsScroll = false
    }
    setTimeout(() => {
      oldStatsList.removeClass('current')
      oldStatsList.removeClass('leave')
      oldStatsList.removeClass(reverse ? 'reverse' : 'forward')
      newStatsList.removeClass(reverse ? 'reverse' : 'forward')
      newStatsList.addClass('current')
      newStatsList.removeClass('enter')
    }, 200)
  }

  onPlayerResize() {
    this.setStatsBoxSize()
  }

  addGeneralMetrics() {
    this.metrics.general = {
      displayResolution: (this.playerWidth + 'x' + this.playerHeight),
      volume: this.container.volume
    }
  }

  updateMetrics(metrics) {
    this.metrics = cloneDeep(metrics)
    this.addGeneralMetrics()

    var scrollTop = this.core.$el.find(this.statsBoxElem).scrollTop()
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
    }))
    this.setStatsBoxSize()

    this.core.$el.find(this.statsBoxElem).scrollTop(scrollTop)

    if (!this.showing) {
      this.hide()
    }
  }

  setStatsBoxSize() {
    if (this.playerWidth >= this.statsBoxWidthThreshold) {
      this.$el.find(this.statsBoxElem).addClass('wide')
      this.$el.find(this.statsBoxElem).removeClass('narrow')
    } else {
      this.$el.find(this.statsBoxElem).removeClass('wide')
      this.$el.find(this.statsBoxElem).addClass('narrow')
    }
  }

  render() {
    const style = Styler.getStyleFor(pluginStyle, {baseUrl: this.options.baseUrl})
    this.core.$el.append(style[0])
    this.core.$el.append(this.$el[0])
    this.hide()
    return this
  }
}
