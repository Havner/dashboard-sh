Unified Dashboard for rF2/AMS2/AC/ACC
Version: 0.5.1
Author: Havner

1. TL;DR

  1. Unpack the content of the ZIP to the SimHub directory
  2. Install the fonts
  3. Have a look at dashboard.js, few options there.
  4. Assign A-D in SimHub, they change some runtime settings
  5. Add the overlay to some overlay layout of yours or run the
     dashboard on your device
  6. Enjoy!

2. About

This is the dashboard I use for quite some time made by me from
scratch. The idea behind it was to have *everything* possible at a
glance, but for it to still be quite readable.

3. Installation

Copy the "JavascriptExtensions" and "DashTemplates" to the SimHub
installation directory, e.g.: "C:\Program Files (x86)\SimHub".

Install the included fonts.

When you launch the SimHub the "Dashboard" and "Dashboard USB" should
appear in "Dash Studio" section, in "Overlays" tab and "Dashboards"
tab respectively. The overlay is to be used on screen. The dashboard
is to be used on some device (phone, USBD480, etc).

The only difference between them is the size and rev lights (removed
from dashboard).

4. Usage

The main area is black when no game is running. It is covered with red
transparent when ignition is off.

Several sections here.

Revlights on top, follow SimHub settings. Can be changed with
ActionD. 3 options here: small, large, empty.

Pedals left and right. Can be changed with ActionC.
For Assetto Corsa they have 3 options: pedals, ERS, empty.
For other games they have 2 options: pedals, empty.

ABS active and TC active are also shown in the background where
available (ACC, AMS2).

Top left (green frame): times. From top to bottom:
- current delta
- current time
- last time
- best time

ActionA changes current delta and best time between session (default,
regular font) to all-time (cursive font).

Top middle (blue frame): gear, speed, RPM. Gear color changes with
RPM. Speed shows pit limiter with color.

Top right (pink frame): tyre wear, tyre press, tyre temps, damage,
brake temps. All color coded.

ActionB changes tyre wear into a display telling how many laps each
tire has if it were to be used as in the last lap.

ACC doesn't have tyre wear, so tyre press is moved in its place. The
empty place has been filled with game clock.

Middle right (grey frame): session type, remaining session left,
completed lap, position.

Bottom right (red frame): fuel per lap, total fuel, remaining
laps. Total fuel with be marked with red background when less than 2
laps left.

Bottom left (brown frame): systems, game options. Every game has
something different here. I've tried to put as much car settings as
possible but this info is lacking in telemetry. Only ACC has it
all. For the rest it's some mix of car settings, difficulty settings,
etc. DRS is shown there where supported.


If you feel like buying me a beer please donate:
https://www.paypal.me/Renvah
Thanks and Have fun!
