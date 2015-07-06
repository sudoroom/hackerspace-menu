This is a little node.js web app that pulls events from an iCal feed and shows events for the next 24 hours on an old OLPC XO-1 laptop. We use this at [sudo room](https://sudoroom.org) and [omni commons](https://omnicommons.org).

The sadly failed OLPC project created a bunch of interesting hardware and many still have old models like the XO-1 laptop lying around their homes. Too interesting to throw away but too slow and tiny to be of much use today. They have one feature that is still rare: In direct sunlight the display becomes a reflective black and white display. Very useful in the California sun.

I decided to use these old laptops as little informational displays mounted on the outside of our hackerspace. They idea being that they'd list upcoming events for the day.

# Setting up the web app

Simply do:

```
npm install
cp settings.js.example settings.js
```

Edit settings.js to your liking, then run:

```
./index.js
```

# Setting up the OLPC XO-1 laptop

This guide will show you how to set up remote X access for the OLPC and display a modern web browser in kiosk mode. You won't have to jailbreak the laptop nor update the operating system. You will need a USB ethernet adapter, or figure out how to set up the wifi on your own.

These instructions are based on OLPC XO-1 operating system build 802, meaning that it was one of the early XO-1 laptops that has never been updated. Newer versions may be different but they're all fedora based so you should be able to find the documentation without too much difficulty.

To get a root shell press ctrl-alt-f2 (f2 is the button at the top with the round symbol with three dots).

Plug in usb ethernet adapter which should come up as eth2.

Create file /etc/sysconfig/network-scripts/ifcfg-eth2

```
DEVICE=eth2
BOOTPROTO=dhcp
ONBOOT=yes
```

Plug in an ethernet cable with Internet and enable networking:

```
/etc/init.d/network start
```

Install lxde and unclutter:

```
yum install lxde-common unclutter
```

Set a password for the olpc user:

```
passwd olpc
```

create /home/olpc/.xsession

```
xhost +192.168.1.1
unclutter -idle 5 & # This hides the mouse cursor
xset s off # disable screen saver
xset -dpms # disable DPMS
xset s noblank # disable screen blanking
xrandr -o left # optional 90 degree rotation
exec ck-xinit-session startlxde
```

Change 192.168.1.1 to the IP of the server you want to allow remote X access for. This does not seem to work for hostnames, only IPs.

Change hostname in /etc/avahi-daemon.conf to e.g. olpc so you can access the laptop remotely using olpc.local

Disable network manager and enable normal network services:

```
chkconfig --level 2345 NetworkManager off
chkconfig --level 2345 network on
```

From the remote machine (space.local) run:

```
DISPLAY=olpc.local:0 chromium-browser --kiosk "https://omnicommons.org/olpc-events"
```

You should make this run on startup.

Make a nice web-page that shows what you want to show and which has javascript to auto-reload every so often.

Put the computer in a nice box with some thick plexiglass and mount it on the outside of your building :)

# License and copyright

This code is licensed under the AGPLv3

Copyright 2015 Marc Juul
