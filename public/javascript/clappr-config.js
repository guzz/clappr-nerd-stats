const playerElement = document.getElementById('player-wrapper')
Clappr.Log.setLevel(Clappr.Log.LEVEL_INFO);

const player = new Clappr.Player({
  source: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
  plugins: [
    window.ClapprNerdStats,
    window.ClapprStats,
    window.LevelSelector,
  ],
  clapprNerdStats: {
    shortcut: ['command+shift+s', 'ctrl+shift+s'],
    iconPosition: 'top-left'
  }
})

player.attachTo(playerElement)
