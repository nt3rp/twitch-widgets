# TODO
There are so many things that this app could do. Here's how I am trying to keep
track of them (as compared to having a million TODOs scattered across files).

# OBS
- [ ] Verify works cross-network
- [ ] Verify chroma key

## Server
- [ ] Have WebSocket connection send relevant information / config on connection
- [ ] Decide if server should do different things on different message types

## CLI
- [ ] Refactor!
- [ ] Find out if there is a Procfile for javascript, to autostart server + CLI
- [ ] Figure out how to dynamically connect to server, wherever it is
- [ ] Handler connection failures
- [ ] Auto-discover widgets
- [ ] Colorize prompts
- [ ] Have all widgets use universal event interface (i.e. first instance of some event my trigger an achievement if 'is_achieveable')
  - Also, create aliases
  - Also, enables the creation of 'on-the-fly' achievements, etc.
- [ ] Figure out how to do options *without* them merely being binary flags

### Achievement
- [ ] Search by tag
- [ ] List all achievements
- [ ] Show details of achievement

### Progress
- [ ] Add flag to toggle between money raised, and game progress
- [ ] Add flag to toggle show this year's progress vs last year's progress
- [ ] Add flag to change the 'in-progress' cursor
- [ ] Add flag to switch if the symbols are above or below the line
- [ ] Sparkline for cash donations?

## Achievement widget
- [ ] Add images to achievements
- [ ] Add remaining border styles
- [ ] Handle multiple achievements triggered at once
- [ ] Scale achievement sizes

## Progress widget
- [ ] Use local version of jquery
- [ ] Do this!
