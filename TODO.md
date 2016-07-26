# TODO
There are so many things that this app could do. Here's how I am trying to keep
track of them (as compared to having a million TODOs scattered across files).

## OBS
- [ ] Verify works cross-network
- [ ] Verify chroma key
- [ ] What happens after long periods of time in CLR browser?

## Server
- [ ] Have WebSocket connection send relevant information / config on connection
- [ ] Decide if server should do different things on different message types

## CLI
- [ ] Refactor!
- [ ] Have each command be an importable module?
- [ ] Make sure required arguments are `<required>` not `[optional]`
- [ ] History / recent / log command to see what has happened lately
- [ ] Challenge accepted / completed command
- [ ] Find out if there is a Procfile for javascript, to autostart server + CLI
- [ ] Figure out how to dynamically connect to server, wherever it is
- [ ] Handler connection failures
- [ ] Auto-discover widgets
- [ ] Colorize prompts
- [ ] Have all widgets use universal event interface (i.e. first instance of some event my trigger an achievement if 'is_achieveable')
  - Also, create aliases
  - Also, enables the creation of 'on-the-fly' achievements, etc.
- [ ] Figure out how to do options *without* them merely being binary flags
- [ ] Determine how to log achievement / progress data + command
  - Maybe wrap commands with `vorpal.use`? Does `vorpal` have middleware?

### Achievement
- [ ] Search by tag
- [ ] List all achievements
- [ ] Show details of achievement

### Progress
- [ ] Add flag to toggle between money raised, and game progress
- [ ] Add flag to toggle show this year's progress vs last year's progress
- [ ] Add flag to change the 'in-progress' cursor
- [ ] Add flag to switch if the symbols are above or below the line
- [ ] Toggle the type of events to display
- [ ] Sparkline for cash donations?

### Player
- [ ] Mass actions on status, etc.

## Achievement widget
- [ ] Add images to achievements
- [ ] Add remaining border styles
- [ ] Queuing / Handle multiple achievements triggered at once
- [ ] Scale achievement sizes

## Progress widget
- [ ] Use local version of jquery
- [ ] Do this!
